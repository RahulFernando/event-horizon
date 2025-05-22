import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { commentId } = await params;

    const comment = await prisma.ticketComment.delete({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        body: true,
        created_at: true,
        created_by: true,
      },
    });

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
