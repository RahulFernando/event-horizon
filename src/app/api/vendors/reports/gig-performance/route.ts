import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findFirst({
      where: {
        user_id: currentUser.id,
      },
      select: {
        id: true,
      },
    });

    if (!vendor) {
      return NextResponse.json({ errors: "Vendor not found" }, { status: 404 });
    }

    const gigs = await prisma.gig.findMany({
      where: {
        vendor_id: vendor.id,
      },
      include: {
        jobs: {
          include: {
            pricingTier: true,
          },
        },
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
    });

    const results = gigs.map((gig) => {
      const totalJobs = gig.jobs.length;
      const completedJobs = gig.jobs.filter(
        (job) => job.status === "COMPLETED"
      ).length;
      const completionRate =
        totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

      let earnings = 0;

      gig.jobs.forEach((job) => {
        if (gig.pricing_mode?.type === "FIXED") {
          earnings += gig.pricing_mode.fixed_rate?.price || 0;
        } else if (gig.pricing_mode?.type === "HOURLY_RATE") {
          const hourlyRate = gig.pricing_mode.hourly_rate?.price || 0;
          const hours = parseFloat(gig.pricing_mode.hourly_rate?.hour || "1");
          earnings += hourlyRate * hours;
        } else if (gig.pricing_mode?.type === "TIERED") {
          earnings += job.pricingTier?.price || 0;
        }
      });

      return {
        id: gig.id,
        title: gig.title,
        totalJobs,
        completedJobs,
        completionRate: completionRate.toFixed(2) + "%",
        earnings,
      };
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
