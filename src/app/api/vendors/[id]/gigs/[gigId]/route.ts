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
        category: { select: { id: true, name: true } },
        event_types: {
          select: { event_type: { select: { id: true, name: true } } },
        },
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

    const { event_type_ids, title, description, location, category_id } = body;

    await updateEventTypes(gigId, event_type_ids);

    const gig = await prisma.gig.update({
      where: { vendor_id: id, id: gigId },
      data: { vendor_id: id, title, description, location, category_id },
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
    return NextResponse.json(gig, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

const updateEventTypes = async (gigId: string, eventTypeIds: string[]) => {
  // remove events that are not new list
  await prisma.eventTypesOnGigs.deleteMany({
    where: {
      event_type_id: { notIn: [...eventTypeIds] },
    },
  });

  // find existing event type ids
  const existingRelations = await prisma.eventTypesOnGigs.findMany({
    where: {
      gig_id: gigId,
      event_type_id: { in: eventTypeIds },
    },
    select: { event_type_id: true },
  });

  const existingEventTypeIds = new Set(
    existingRelations.map((rel) => rel.event_type_id)
  );

  const eventTypesToAdd = eventTypeIds.filter(
    (id: string) => !existingEventTypeIds.has(id)
  );

  // create new event types
  if (eventTypesToAdd.length > 0) {
    await prisma.eventTypesOnGigs.createMany({
      data: eventTypesToAdd.map((id: string) => ({
        gig_id: gigId,
        event_type_id: id,
      })),
    });
  }
};

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
