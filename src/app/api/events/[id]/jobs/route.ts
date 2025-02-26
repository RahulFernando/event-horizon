import prisma from "@/lib/prisma";
import { jobValidationSchema } from "@/lib/validations/events/job-validation-schema";
import { PricingTier } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const jobs = await prisma.job.findMany({
      where: { event_id: id },
      select: {
        id: true,
        gig: {
          select: {
            id: true,
            title: true,
            location: true,
            description: true,
            vendor: { select: { user: { select: { name: true } } } },
          },
        },
        pricingTier: {
          select: { id: true, level: true, description: true, price: true },
        },
        status: true,
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id } = await params;

  try {
    await jobValidationSchema.validate(body, { abortEarly: true });

    const { pricing_tier_id } = body;
    let pricingTier: PricingTier | null = null;

    if (pricing_tier_id) {
      pricingTier = await prisma.pricingTier.findFirst({
        where: { id: pricing_tier_id },
      });
    }

    console.log(pricingTier);

    const newJob = await prisma.job.create({
      data: {
        ...body,
        event_id: id,
        ...(pricingTier && {
          pricing_tier_id: pricingTier.id,
          pricing_tier_tiered_id: pricingTier.tiered_id,
        }),
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      },
      select: {
        id: true,
        event_id: true,
        gig_id: true,
      },
    });

    return NextResponse.json({ ...newJob }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
