import prisma from "@/lib/prisma";
import { PricingModelType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; pricingId: string } }
) {
  const { id, pricingId } = await params;
  const { fixed, hourlyRate, tiered } = await req.json();

  const pricingModel = await prisma.pricingModel.findFirst({
    where: { gig_id: id, id: pricingId },
    select: {
      id: true,
      gig_id: true,
      type: true,
      fixed_rate: true,
      hourly_rate: true,
      tiered: true,
    },
  });

  if (!pricingModel) {
    return NextResponse.json({}, { status: 404 });
  }

  if (pricingModel.type === PricingModelType.FIXED && pricingModel.fixed_rate) {
    const updatedFixedRate = await prisma.fixedRate.update({
      where: { id: pricingModel.fixed_rate.id },
      data: { ...fixed },
    });
    return NextResponse.json(
      { ...pricingModel, fixed_rate: updatedFixedRate },
      { status: 200 }
    );
  }

  if (
    pricingModel.type === PricingModelType.HOURLY_RATE &&
    pricingModel.hourly_rate
  ) {
    const updatedHourlyRate = await prisma.hourlyRate.update({
      where: { id: pricingModel.hourly_rate.id },
      data: { hour: hourlyRate.hour, price: hourlyRate.price },
    });
    return NextResponse.json(
      { ...pricingModel, hourly_rate: updatedHourlyRate },
      { status: 200 }
    );
  }

  if (pricingModel.type === PricingModelType.TIERED && pricingModel.tiered) {
    const { id } = pricingModel.tiered;

    await prisma.pricingTier.deleteMany({ where: { tiered_id: id } });

    const createdTiers = await prisma.pricingTier.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: tiered.map((tier: any) => ({
        ...tier,
        tiered_id: id,
      })),
    });

    return NextResponse.json(
      {
        ...pricingModel,
        tiered: {
          id,
          pricing_tiers: createdTiers,
        },
      },
      { status: 200 }
    );
  }

  try {
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
