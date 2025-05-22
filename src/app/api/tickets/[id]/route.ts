import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { createTicketValidationSchema } from "@/lib/validations/tickets/create-validation";
import { ValidationError } from "yup";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const ticket = await prisma.ticket.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            account: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();

    await createTicketValidationSchema.validate(body, { abortEarly: false });

    const ticket = await prisma.ticket.update({
      where: {
        id,
      },
      data: {
        ...body,
        updated_by: currentUser.name,
      },
    });

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();

    const ticket = await prisma.ticket.update({
      where: {
        id,
      },
      data: {
        ...body,
        updated_by: currentUser.name,
      },
    });

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const ticket = await prisma.ticket.delete({
      where: {
        id,
        AND: {
          status: "OPEN",
        },
      },
    });

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
