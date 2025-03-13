import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { Event, Gig, Job } from "@prisma/client";
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

  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: body.status },
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
      },
    });

    if (body.status === "ACCEPTED") {
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
