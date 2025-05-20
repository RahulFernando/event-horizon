import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { is_deleted } = await req.json();

  try {
    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: { is_deleted },
      select: {
        id: true,
        is_deleted: true,
      },
    });
    return NextResponse.json(updatedVendor, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.update({
      where: {
        id,
      },
      data: {
        ...body,
        updated_by: currentUser.name,
      },
    });
    return NextResponse.json(vendor, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
