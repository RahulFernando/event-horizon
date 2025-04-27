import prisma from "@/lib/prisma";
import { createOrganizerValidationSchema } from "@/lib/validations/organizers/create-organizer-validation-schema";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET() {
  try {
    const organizers = await prisma.organizer.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        national_identity: true,
        user_id: true,
      },
    });
    const count = await prisma.organizer.count();
    return NextResponse.json({ items: organizers, count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  try {
    await createOrganizerValidationSchema.validate(body, { abortEarly: false });

    const organizer = await prisma.organizer.create({
      data: {
        ...body,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        national_identity: true,
        user_id: true,
      },
    });
    return NextResponse.json({ ...organizer }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const body = await req.json();

  try {
    if (!userId) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 400 });
    }

    const updateOrganizer = await prisma.organizer.update({
      where: { user_id: userId },
      data: body,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        national_identity: true,
        user_id: true,
      },
    });
    return NextResponse.json({ ...updateOrganizer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
