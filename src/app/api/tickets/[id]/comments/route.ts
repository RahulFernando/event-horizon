import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const comments = await prisma.ticketComment.findMany({
      where: {
        ticket_id: id,
      },
      select: {
        id: true,
        body: true,
        created_at: true,
        created_by: true,
      },
    });

    return NextResponse.json(
      { count: comments.length, items: comments },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const comment = await prisma.ticketComment.create({
      data: {
        ...body,
        ticket_id: id,
        created_by: currentUser.name,
        updated_by: currentUser.name,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
