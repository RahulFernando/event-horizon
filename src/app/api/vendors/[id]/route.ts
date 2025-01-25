import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const vendor = await prisma.vendor.findFirst({
      where: { id },
      select: {
        id: true,
        business_registration: true,
        taxpayer_identification_number: true,
        user_id: true,
        container: true,
      },
    });
    return NextResponse.json(vendor, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
