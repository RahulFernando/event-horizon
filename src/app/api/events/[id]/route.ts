import prisma from "@/lib/prisma";
import { eventValidationSchema } from "@/lib/validations/events/validation-schema";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const event = await prisma.event.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        date_time: true,
        duration: true,
        event_type: { select: { id: true, name: true } },
        organizer_id: true,
        venue: true,
      },
    });

    return NextResponse.json({ ...event }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id } = await params;

  await eventValidationSchema.validate(body, { abortEarly: true });

  try {
    const event = await prisma.event.update({
      where: { id },
      data: body,
      select: {
        id: true,
        title: true,
        date_time: true,
        duration: true,
        event_type: { select: { id: true, name: true } },
        organizer_id: true,
        venue: true,
      },
    });

    return NextResponse.json({ ...event }, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
