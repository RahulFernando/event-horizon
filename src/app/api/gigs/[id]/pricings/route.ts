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
  const eventId = req.nextUrl.searchParams.get("eventId"); // Assuming you pass the event ID to check existing jobs

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
    let remainingBudget = budget ? +budget : 0;

    // calculate remaining budget by deducting prices from existing jobs
    if (eventId && remainingBudget > 0) {
      const existingJobs = await prisma.job.findMany({
        where: {
          event_id: eventId,
          status: { in: ["PENDING", "ACCEPTED", "ACTIVE"] },
        },
        include: {
          gig: {
            include: {
              pricing_mode: {
                include: {
                  fixed_rate: true,
                  hourly_rate: true,
                  tiered: {
                    include: {
                      pricing_tiers: true,
                    },
                  },
                },
              },
            },
          },
          pricingTier: true,
        },
      });

      // calculate total cost of existing jobs
      const totalExistingCost = existingJobs.reduce((total, job) => {
        const pricingMode = job.gig.pricing_mode;
        if (!pricingMode) return total;

        switch (pricingMode.type) {
          case "FIXED":
            return total + (pricingMode.fixed_rate?.price || 0);
          case "HOURLY_RATE":
            return total + (pricingMode.hourly_rate?.price || 0);
          case "TIERED":
            return total + (job.pricingTier?.price || 0);
          default:
            return total;
        }
      }, 0);

      remainingBudget = remainingBudget - totalExistingCost;
    }

    // filter pricing model based on remaining budget
    if (pricingModel && remainingBudget > 0) {
      switch (pricingModel.type) {
        case "FIXED":
          if (
            pricingModel.fixed_rate &&
            pricingModel.fixed_rate.price > remainingBudget
          ) {
            pricingModel.fixed_rate = null;
          }
          break;

        case "HOURLY_RATE":
          if (
            pricingModel.hourly_rate &&
            pricingModel.hourly_rate.price > remainingBudget
          ) {
            pricingModel.hourly_rate = null;
          }
          break;

        case "TIERED":
          if (pricingModel.tiered) {
            const affordableTiers = pricingModel.tiered.pricing_tiers.filter(
              (tier) => tier.price <= remainingBudget
            );
            pricingModel = {
              ...pricingModel,
              tiered: {
                ...pricingModel.tiered,
                pricing_tiers: affordableTiers,
              },
            };
          }
          break;
      }
    }

    return NextResponse.json(
      {
        pricingModel,
        budgetInfo: {
          originalBudget: budget ? +budget : 0,
          remainingBudget: Math.max(0, remainingBudget),
          hasAffordableOptions: hasAffordableOptions(
            pricingModel,
            remainingBudget
          ),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error filtering pricing model:", error);
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

function hasAffordableOptions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pricingModel: any,
  remainingBudget: number
): boolean {
  if (!pricingModel || remainingBudget <= 0) return false;

  switch (pricingModel.type) {
    case "FIXED":
      return pricingModel.fixed_rate !== null;
    case "HOURLY_RATE":
      return pricingModel.hourly_rate !== null;
    case "TIERED":
      return pricingModel.tiered?.pricing_tiers?.length > 0;
    default:
      return false;
  }
}

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = await params;
//   const budget = req.nextUrl.searchParams.get("budget");

//   try {
//     const _pricingModel = await prisma.pricingModel.findFirst({
//       where: { gig_id: id },
//       select: {
//         id: true,
//         type: true,
//         fixed_rate: true,
//         hourly_rate: true,
//         tiered: {
//           select: {
//             id: true,
//             pricing_tiers: {
//               select: { id: true, level: true, description: true, price: true },
//             },
//           },
//         },
//       },
//     });

//     let pricingModel = { ..._pricingModel };

//     // TODO: filter other pricing model as well.
//     if (pricingModel && pricingModel.tiered && budget) {
//       const tiers = pricingModel.tiered.pricing_tiers.filter(
//         (tier) => tier.price <= +budget
//       );
//       pricingModel = {
//         ...pricingModel,
//         tiered: { ...pricingModel.tiered, pricing_tiers: tiers },
//       };
//     }

//     return NextResponse.json(pricingModel, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ errors: [error] }, { status: 500 });
//   }
// }

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
