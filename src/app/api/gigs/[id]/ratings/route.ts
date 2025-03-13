import { withAuth } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const { id } = await params;

    const currentUserName = user.name;

    try {
      const rating = await prisma.userRating.create({
        data: {
          ...body,
          gig_id: id,
          created_by: currentUserName,
          updated_by: currentUserName,
        },
      });

      return NextResponse.json(rating, { status: 201 });
    } catch (error) {
      return NextResponse.json({ errors: [error] }, { status: 500 });
    }
  });
}
