import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { createTicketValidationSchema } from "@/lib/validations/tickets/create-validation";
import { ValidationError } from "yup";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        ...(userId && {
          user_id: userId,
        }),
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
      orderBy: {
        updated_at: "desc",
      },
    });

    return NextResponse.json(
      { count: tickets.length, items: tickets },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await createTicketValidationSchema.validate(body, { abortEarly: false });

    const ticket = await prisma.ticket.create({
      data: {
        ...body,
        user_id: currentUser.id,
        created_by: currentUser.name,
        updated_by: currentUser.name,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
