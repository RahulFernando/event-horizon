import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; jobId: string } }
) {
  const { jobId } = await params;
  const body = await req.json();

  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: body.status },
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

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
