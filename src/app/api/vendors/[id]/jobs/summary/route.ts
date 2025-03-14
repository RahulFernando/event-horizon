import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const totalJobs = await prisma.job.count({
      where: { gig: { vendor_id: id } },
    });

    const completedJobs = await prisma.job.count({
      where: { gig: { vendor_id: id }, status: "COMPLETED" },
    });

    // Calculate completion percentage
    const completionPercentage =
      totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

    return NextResponse.json(
      {
        vendor_id: id,
        total_jobs: totalJobs,
        completed_jobs: completedJobs,
        completion_percentage: completionPercentage.toFixed(2),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
