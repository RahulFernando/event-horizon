import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const vendor = await prisma.vendor.findFirst({
      where: { business_registration: body.business_registration },
    });

    if (vendor) {
      return NextResponse.json(
        { errors: ["Vendor already exist with this business registration"] },
        { status: 409 }
      );
    }

    console.log(body);

    const newVendor = await prisma.vendor.create({
      data: {
        ...body,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      },
      select: {
        id: true,
        business_registration: true,
        taxpayer_identification_number: true,
      },
    });

    return NextResponse.json(
      {
        ...newVendor,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
