import prisma from "@/lib/prisma";
import { eventValidationSchema } from "@/lib/validations/events/validation-schema";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        date_time: true,
        duration: true,
        event_type: { select: { id: true, name: true } },
        venue: true,
      },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ erros: [error] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  try {
    await eventValidationSchema.validate(body, { abortEarly: false });

    const newEvent = await prisma.event.create({
      data: {
        ...body,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      },
      select: {
        id: true,
        title: true,
        venue: true,
        date_time: true,
        duration: true,
        event_type: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ ...newEvent }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ erros: [error] }, { status: 500 });
  }
}
