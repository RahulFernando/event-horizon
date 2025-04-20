import prisma from "@/lib/prisma";
import { createPricingModelValidationSchema } from "@/lib/validations/pricing/create-pricing-model-validation";
import { PricingModelType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const budget = req.nextUrl.searchParams.get("budget");

  try {
    const _pricingModel = await prisma.pricingModel.findFirst({
      where: { gig_id: id },
      select: {
        id: true,
        type: true,
        fixed_rate: true,
        hourly_rate: true,
        tiered: {
          select: {
            id: true,
            pricing_tiers: {
              select: { id: true, level: true, description: true, price: true },
            },
          },
        },
      },
    });

    let pricingModel = { ..._pricingModel };

    // TODO: filter other pricing model as well.
    if (pricingModel && pricingModel.tiered && budget) {
      const tiers = pricingModel.tiered.pricing_tiers.filter(
        (tier) => tier.price <= +budget
      );
      pricingModel = {
        ...pricingModel,
        tiered: { ...pricingModel.tiered, pricing_tiers: tiers },
      };
    }

    return NextResponse.json(pricingModel, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id } = await params;

  try {
    await createPricingModelValidationSchema.validate(body, {
      abortEarly: true,
    });
    const { type, fixed, hourlyRate, tiered } = body;
    let pricingModel;

    const result = await prisma.$transaction(async (transactionPrisma) => {
      pricingModel = await transactionPrisma.pricingModel.create({
        data: {
          gig_id: id,
          type,
          created_by: "unauthorized user",
          updated_by: "unauthorized user",
        },
      });

      if (type === PricingModelType.FIXED) {
        await transactionPrisma.fixedRate.create({
          data: {
            price: fixed.price,
            pricing_model_id: pricingModel.id,
          },
        });
      }

      if (type === PricingModelType.HOURLY_RATE) {
        await transactionPrisma.hourlyRate.create({
          data: {
            hour: hourlyRate.hour,
            price: hourlyRate.price,
            pricing_model_id: pricingModel.id,
          },
        });
      }

      if (type === PricingModelType.TIERED) {
        const tieredModel = await transactionPrisma.tiered.create({
          data: {
            pricing_model_id: pricingModel.id,
          },
        });
        if (tiered.pricingTiers && tiered.pricingTiers.length > 0) {
          await transactionPrisma.pricingTier.createMany({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: tiered.pricingTiers.map((tier: any) => ({
              level: tier.level,
              description: tier.description,
              price: tier.price,
              tiered_id: tieredModel.id,
            })),
          });
        }
      }

      return pricingModel;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
