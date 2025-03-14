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

      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          status: body.status as JobStatus,
          updated_by: currentUserName,
        },
        include: { event: true, gig: true, pricingTier: true },
      });

      return NextResponse.json(updatedJob, { status: 200 });
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
