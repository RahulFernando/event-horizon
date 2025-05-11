import { IJob, PrismaTransaction } from "@/app/types/api";
import { withAuth } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { jobStatusUpdateSchema } from "@/lib/validations/jobs/update-job";
import { JobStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const job = await prisma.job.findFirst({
      where: { id },
      include: { event: true, gig: true, pricingTier: true },
    });

    const priceModel = await getPriceModel(job?.gig_id ?? "");

    return NextResponse.json({ ...job, priceModel }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

const getPriceModel = async (gigId: string) => {
  const pricingModel = await prisma.pricingModel.findFirst({
    where: { gig_id: gigId },
    include: { fixed_rate: true, hourly_rate: true },
  });

  if (pricingModel?.type === "FIXED") {
    return pricingModel.fixed_rate;
  }

  if (pricingModel?.type === "HOURLY_RATE") {
    return pricingModel.hourly_rate;
  }

  return null;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (req, user) => {
    const { id } = await params;

    try {
      const currentUserName = user.name;
      const body = await req.json();

      await jobStatusUpdateSchema.validate(body, { abortEarly: false });

      const existingJob = await prisma.job.findUnique({
        where: { id },
      });

      if (!existingJob) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      const status = body.status as JobStatus;

      return await prisma.$transaction(async (tx) => {
        const updatedJob = await tx.job.update({
          where: { id },
          data: {
            status,
            updated_by: currentUserName,
          },
          include: { event: true, gig: true, pricingTier: true },
        });

        if (status === "ACCEPTED") {
          const existingInvoice = await prisma.invoice.findFirst({
            where: {
              job_id: updatedJob.id,
            },
          });

          if (!existingInvoice) {
            const gigPrice = await findGigPrice(tx, updatedJob as IJob);

            if (!gigPrice) {
              return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 }
              );
            }

            await tx.invoice.create({
              data: {
                job_id: updatedJob.id,
                total_amount: gigPrice,
              },
            });
          }
        }

        return NextResponse.json(updatedJob, { status: 200 });
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
      }
      return NextResponse.json(
        { error: "Failed to update job status" },
        { status: 500 }
      );
    }
  });
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
