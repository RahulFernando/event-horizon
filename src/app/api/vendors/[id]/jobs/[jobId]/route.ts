import { IJob, PrismaTransaction } from "@/app/types/api";
import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { Event, Gig, Job, JobStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const checkIfCalendarDateExists = async (gig: Gig, job: Job) => {
  const calendar = await prisma.calendar.findFirst({
    where: {
      job_id: job.id,
      vendor_id: gig.vendor_id,
    },
  });

  return calendar !== null;
};

const addToCalendar = async (
  event: Event,
  gig: Gig,
  job: Job,
  currentUserName: string
) => {
  const calendar = await prisma.calendar.create({
    data: {
      job_id: job.id,
      date_time: event.date_time,
      vendor_id: gig.vendor_id,
      created_by: currentUserName,
      updated_by: currentUserName,
    },
  });

  return calendar;
};

const createConversation = async (
  participantIds: string[],
  currentUserName: string
) => {
  await prisma.conversation.create({
    data: {
      title: "",
      created_by: currentUserName,
      updated_by: currentUserName,
      participants: {
        create: participantIds.map((userId) => ({
          user_id: userId,
          created_by: currentUserName,
          updated_by: currentUserName,
        })),
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; jobId: string } }
) {
  const currentUser = await getAuthUser(req);
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserName = currentUser.name;
  const { jobId } = await params;
  const body = await req.json();

  const status = body.status as JobStatus;

  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status },
      include: {
        event: {
          include: {
            organizer: true,
          },
        },
        gig: {
          include: {
            vendor: true,
          },
        },
        pricingTier: true,
      },
    });

    if (status === "ACCEPTED") {
      const calendarExists = await checkIfCalendarDateExists(job.gig, job);

      if (!calendarExists) {
        await addToCalendar(job.event, job.gig, job, currentUserName);
      }

      const participants = [
        job.event.organizer.user_id,
        job.gig.vendor.user_id,
      ];
      await createConversation(participants, currentUserName);
    }

    await prisma.$transaction(async (tx) => {
      if (status === "ACCEPTED") {
        const existingInvoice = await prisma.invoice.findFirst({
          where: {
            job_id: job.id,
          },
        });

        if (!existingInvoice) {
          const gigPrice = await findGigPrice(tx, job as IJob);

          if (!gigPrice) {
            return NextResponse.json(
              { error: "Something went wrong" },
              { status: 500 }
            );
          }

          await tx.invoice.create({
            data: {
              job_id: job.id,
              total_amount: gigPrice,
            },
          });
        }
      }
    });

    const selectedJob = {
      id: job.id,
      status: job.status,
      event: {
        id: job.event.id,
        title: job.event.title,
        venue: job.event.venue,
      },
      gig: {
        id: job.gig.id,
        title: job.gig.title,
        vendor_id: job.gig.vendor_id,
      },
    };

    return NextResponse.json(selectedJob, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

const findGigPrice = async (tx: PrismaTransaction, job: IJob) => {
  if (job.pricingTier) {
    return job.pricingTier.price;
  }

  const pricingModel = await tx.pricingModel.findFirst({
    where: { gig_id: job.gig_id },
    include: { hourly_rate: true, fixed_rate: true },
  });

  if (!pricingModel) {
    return;
  }

  if (pricingModel.fixed_rate) {
    return pricingModel.fixed_rate.price;
  }

  const event = await tx.event.findFirst({
    where: {
      id: job.event_id,
    },
  });

  const hours = event?.duration ?? "1";

  if (pricingModel.hourly_rate) {
    return pricingModel.hourly_rate.price * +hours;
  }

  return;
};
