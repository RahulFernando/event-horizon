import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const jobs = await prisma.job.findMany({
      where: { gig: { vendor_id: id } },
      select: {
        id: true,
        status: true,
        event: {
          select: {
            id: true,
            title: true,
            venue: true,
          },
        },
        gig: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
