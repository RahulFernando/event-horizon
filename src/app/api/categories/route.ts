import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, img_url: true },
    });

    return NextResponse.json(
      { count: categories.length, items: categories },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
