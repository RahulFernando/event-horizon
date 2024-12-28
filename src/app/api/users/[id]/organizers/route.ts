import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        organizers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            national_identity: true,
          },
        },
      },
    });
    return NextResponse.json({ ...user?.organizers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
