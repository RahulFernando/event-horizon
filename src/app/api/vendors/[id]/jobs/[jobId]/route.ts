import prisma from "@/lib/prisma";
import { Event, Gig, Job } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const checkIfCalendarDateExists = async (gig: Gig, job: Job) => {
  const calendar = await prisma.calendar.findFirst({
    where: {
      job_id: job.id,
      vendor_id: gig.vendor_id,
    },
  });

  return calendar !== null;
};

const addToCalendar = async (event: Event, gig: Gig, job: Job) => {
  const calendar = await prisma.calendar.create({
    data: {
      job_id: job.id,
      date_time: event.date_time,
      vendor_id: gig.vendor_id,
      created_by: "unauthorized user",
      updated_by: "unauthorized user",
    },
  });

  return calendar;
};

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
      include: { event: true, gig: true },
    });

    if (body.status === "ACCEPTED") {
      const calendarExists = await checkIfCalendarDateExists(job.gig, job);

      if (!calendarExists) {
        await addToCalendar(job.event, job.gig, job);
      }
    }

    const selectedJob = {
      id: job.id,
      status: job.status,
      event: {
        id: job.event.id,
        title: job.event.title,
        venue: job.event.venue,
      },
      gig: {
        id: job.gig.id,
        title: job.gig.title,
        vendor_id: job.gig.vendor_id,
      },
    };

    return NextResponse.json(selectedJob, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
