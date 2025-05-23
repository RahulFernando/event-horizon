import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { IMonthlyEarningJob } from "@/app/types";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      where: {
        status: { in: ["COMPLETED"] },
      },
      include: {
        gig: {
          include: {
            pricing_mode: {
              include: {
                fixed_rate: true,
                hourly_rate: true,
                tiered: {
                  include: { pricing_tiers: true },
                },
              },
            },
          },
        },
        event: true,
        pricingTier: true,
      },
    });

    const monthlyEarnings = calculateMonthlyEarnings(
      jobs as IMonthlyEarningJob[]
    );

    return NextResponse.json(monthlyEarnings, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export function calculateMonthlyEarnings(
  jobsWithGigData: IMonthlyEarningJob[]
) {
  const monthlyMap = new Map();

  for (const job of jobsWithGigData) {
    const month = format(new Date(job.created_at), "yyyy-MM");

    let earnings = 0;

    const pricingMode = job.gig.pricing_mode;

    if (pricingMode?.type === "FIXED") {
      earnings = pricingMode.fixed_rate?.price || 0;
    } else if (pricingMode?.type === "HOURLY_RATE") {
      const rate = pricingMode.hourly_rate?.price || 0;
      const hours = parseFloat(job.event.duration || "1");
      earnings = rate * hours;
    } else if (pricingMode?.type === "TIERED") {
      earnings = job.pricingTier?.price || 0;
    }

    monthlyMap.set(month, (monthlyMap.get(month) || 0) + earnings);
  }

  return Array.from(monthlyMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([month, earnings]) => ({ month, earnings }));
}
