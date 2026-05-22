import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { IMonthlyEarningJob } from "@/app/types/api";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { user_id: currentUser.id },
      select: { id: true },
    });

    if (!vendor) {
      return NextResponse.json({ errors: "Vendor not found" }, { status: 404 });
    }

    const jobs = await prisma.job.findMany({
      where: {
        status: { in: ["COMPLETED"] },
        gig: { vendor_id: vendor.id },
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
        invoice: {
          include: {
            payments: true,
          },
        },
        event: true,
        pricingTier: true,
      },
    });

    const monthlyEarnings = calculateMonthlyEarningsAlternative(
      jobs as IMonthlyEarningJob[],
    );

    return NextResponse.json(monthlyEarnings, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export function calculateMonthlyEarnings(
  jobsWithGigData: IMonthlyEarningJob[],
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

function calculateMonthlyEarningsAlternative(
  jobsWithGigData: IMonthlyEarningJob[],
) {
  const monthlyMap = new Map();

  for (const job of jobsWithGigData) {
    const month = format(new Date(job.created_at), "yyyy-MM");
    let earnings = 0;

    if (
      job.invoice &&
      job.invoice.payments &&
      job.invoice.payments.length > 0
    ) {
      earnings = job.invoice.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      );
    } else {
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
    }

    monthlyMap.set(month, (monthlyMap.get(month) || 0) + earnings);
  }

  return Array.from(monthlyMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([month, earnings]) => ({ month, earnings }));
}
