import prisma from "@/lib/prisma";
import { createGigValidationSchema } from "@/lib/validations/gigs/create-validation-schema";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET(req: NextRequest) {
  // const location = req.nextUrl.searchParams.get("location");
  const eventType = req.nextUrl.searchParams.get("eventType");

  try {
    const gigs = await prisma.gig.findMany({
      where: {
        // ...(location && {
        //   location: { contains: location, mode: "insensitive" },
        // }),
        ...(eventType && {
          event_types: {
            some: {
              event_type: {
                name: { contains: eventType, mode: "insensitive" },
              },
            },
          },
        }),
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
        vendor: {
          select: { id: true, user: { select: { id: true, name: true } } },
        },
      },
    });
    return NextResponse.json(
      { count: gigs.length, items: gigs },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  try {
    await createGigValidationSchema.validate(body, { abortEarly: true });

    const { event_type_ids } = body;

    const gig = await prisma.gig.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        vendor_id: body.vendor_id,
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
