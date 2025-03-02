import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        status: true,
        created_at: true,
        updated_at: true,
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
    });

    const count = await prisma.job.count();

    return NextResponse.json({ items: jobs, count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
