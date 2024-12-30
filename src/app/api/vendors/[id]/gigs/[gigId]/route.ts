import prisma from "@/lib/prisma";
import { createGigValidationSchema } from "@/lib/validations/gigs/create-validation-schema";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string; gigId: string } }
) {
  const { id, gigId } = await params;

  try {
    const gig = await prisma.gig.findFirst({
      where: { vendor_id: id, id: gigId },
      select: {
        id: true,
        blob_url: true,
        title: true,
        description: true,
        event_type: { select: { id: true, name: true } },
        location: true,
        vendor_id: true,
      },
    });
    return NextResponse.json(gig, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string; gigId: string } }
) {
  const { id, gigId } = await params;
  const body = await req.json();

  try {
    await createGigValidationSchema.validate(
      { ...body, vendor_id: id },
      { abortEarly: true }
    );

    const gig = await prisma.gig.update({
      where: { vendor_id: id, id: gigId },
      data: { ...body, vendor_id: id },
      select: {
        id: true,
        blob_url: true,
        title: true,
        description: true,
        event_type: { select: { id: true, name: true } },
        location: true,
        vendor_id: true,
      },
    });
    return NextResponse.json(gig, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; gigId: string } }
) {
  const { id, gigId } = await params;
  try {
    await prisma.gig.delete({ where: { id: gigId, vendor_id: id } });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
