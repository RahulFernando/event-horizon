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

export async function GET(req: NextRequest) {
  const top = req.nextUrl.searchParams.get("top");
  try {
    if (top) {
      const vendorsWithRatings = await prisma.vendor.findMany({
        select: {
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

      const vendorsWithAvgRating = calculateVendorRatings(vendorsWithRatings);

      const topVendors = vendorsWithAvgRating
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 5);

      return NextResponse.json(
        { count: topVendors.length, items: topVendors },
        { status: 200 }
      );
    }

    const vendors = await prisma.vendor.findMany({
      select: {
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
      },
    });

    const count = await prisma.vendor.count();

    return NextResponse.json({ items: vendors, count }, { status: 200 });
  } catch (error) {
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
