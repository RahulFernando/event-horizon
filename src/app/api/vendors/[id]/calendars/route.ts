import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: vendorId } = params;

  try {
    const calendarRecords = await prisma.calendar.findMany({
      where: { vendor_id: vendorId },
      select: {
        id: true,
        job_id: true,
        date_time: true,
        job: {
          select: {
            id: true,
            status: true,
            gig: {
              select: {
                id: true,
                title: true,
              },
            },
            event: {
              select: {
                id: true,
                title: true,
                venue: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(calendarRecords, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
