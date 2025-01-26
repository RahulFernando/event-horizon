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
    const gigs = await prisma.gig.findMany({
      where: { vendor_id: id },
      select: {
        id: true,
        blob_url: true,
        title: true,
        description: true,
        category: { select: { id: true, name: true } },
        event_types: {
          select: { event_type: { select: { id: true, name: true } } },
        },
        location: true,
        vendor_id: true,
      },
    });
    return NextResponse.json(
      { count: gigs.length, items: [...gigs] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id } = await params;

  try {
    await createGigValidationSchema.validate(
      { ...body, vendor_id: id },
      { abortEarly: true }
    );

    const { event_type_ids } = body;

    const gig = await prisma.gig.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        category_id: body.category_id,
        vendor_id: id,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
        event_types: {
          create: event_type_ids.map((id: string) => ({
            event_type: {
              connect: { id },
            },
          })),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        category_id: true,
        blob_url: true,
        event_types: {
          select: { event_type: { select: { id: true, name: true } } },
        },
        vendor_id: true,
      },
    });

    return NextResponse.json(gig, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
