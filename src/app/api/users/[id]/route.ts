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
        id: true,
        name: true,
        contacts: true,
        addresses: true,
        user_type: true,
      },
    });
    return NextResponse.json({ ...user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
