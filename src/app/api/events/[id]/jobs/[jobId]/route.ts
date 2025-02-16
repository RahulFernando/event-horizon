import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; jobId: string } }
) {
  const { jobId, id: eventId } = await params;

  try {
    await prisma.job.delete({
      where: { id: jobId, event_id: eventId },
    });

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
