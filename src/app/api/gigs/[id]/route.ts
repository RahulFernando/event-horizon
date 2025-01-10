import prisma from "@/lib/prisma";
import { createGigValidationSchema } from "@/lib/validations/gigs/create-validation-schema";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const gig = await prisma.gig.findFirst({
      where: { id },
      select: {
        id: true,
        blob_url: true,
        title: true,
        description: true,
        event_types: {
          select: { event_type: { select: { id: true, name: true } } },
        },
        location: true,
        vendor: {
          select: { id: true, user: { select: { id: true, name: true } } },
        },
      },
    });
    return NextResponse.json(gig, { status: 200 });
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

  try {
    await createGigValidationSchema.validate(body, { abortEarly: true });

    const { event_type_ids, ...otherFields } = body;

    if (!id) {
      return NextResponse.json(
        { errors: ["Gig ID is required"] },
        { status: 400 }
      );
    }

    const existingGig = await prisma.gig.findUnique({ where: { id } });

    if (!existingGig) {
      return NextResponse.json({ errors: ["Gig not found"] }, { status: 404 });
    }

    // Update the gig
    const updatedGig = await prisma.gig.update({
      where: { id },
      data: {
        ...otherFields,
        event_types: {
          deleteMany: {},
          create: event_type_ids.map((eventTypeId: string) => ({
            event_type: {
              connect: { id: eventTypeId },
            },
          })),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        blob_url: true,
        event_types: {
          select: { event_type: { select: { id: true, name: true } } },
        },
        vendor_id: true,
      },
    });

    return NextResponse.json(updatedGig, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
