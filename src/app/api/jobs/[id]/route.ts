import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
