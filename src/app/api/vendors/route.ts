/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Vendor, VendorWithRating } from "../types/api.type";

const calculateVendorRatings = (vendors: Vendor[]): VendorWithRating[] => {
  return vendors.map((vendor) => {
    const allRatings = vendor.gigs.flatMap((gig) =>
      gig.user_ratings.map((rating) => rating.rating)
    );

    // Calculate average rating or default to 0 if no ratings
    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, rating) => sum + rating, 0) /
          allRatings.length
        : 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { gigs, ...vendorWithoutGigs } = vendor;

    return {
      ...vendorWithoutGigs,
      averageRating: avgRating,
      totalRatings: allRatings.length,
    };
  });
};

const findCategoryByName = async (keyword: string) =>
  await prisma.category.findFirst({
    where: { name: { contains: keyword, mode: "insensitive" } },
  });

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const top = searchParams.get("top");
  const _category = searchParams.get("category");

  try {
    const baseSelect = {
      id: true,
      business_registration: true,
      taxpayer_identification_number: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          name: true,
          contacts: true,
        },
      },
      is_deleted: true,
    };

    const whereClause: any = {};

    if (_category) {
      const category = await findCategoryByName(_category);
      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
      whereClause.gigs = { some: { category_id: category.id } };
    }

    const vendors = await prisma.vendor.findMany({
      where: whereClause,
      select: {
        ...baseSelect,
        gigs: {
          select: {
            id: true,
            user_ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });
    const vendorsWithAvgRating = calculateVendorRatings(vendors);

    if (top) {
      const topVendors = vendorsWithAvgRating
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, parseInt(top) || 5);

      return NextResponse.json(
        { count: topVendors.length, items: topVendors },
        { status: 200 }
      );
    } else {
      const count = await prisma.vendor.count({ where: whereClause });

      return NextResponse.json(
        { items: vendorsWithAvgRating, count },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error filtering vendors:", error);
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

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
