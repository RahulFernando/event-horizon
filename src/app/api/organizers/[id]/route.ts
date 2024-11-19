import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const organizer = await prisma.organizer.findFirst({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        national_identity: true,
        user_id: true,
      },
    });
    return NextResponse.json({ ...organizer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const updateOrganizer = await prisma.organizer.update({
      where: { id },
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    await prisma.organizer.delete({ where: { id } });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
