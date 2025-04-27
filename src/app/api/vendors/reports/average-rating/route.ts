/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthUser(req);

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const vendor = await prisma.vendor.findFirst({
      where: {
        user_id: currentUser.id,
      },
      select: {
        id: true,
      },
    });

    if (!vendor) {
      return NextResponse.json({ errors: "Vendor not found" }, { status: 404 });
    }

    const ratings = await prisma.userRating.findMany({
      where: {
        gig: {
          vendor_id: vendor.id,
        },
      },
      select: {
        id: true,
        rating: true,
        gig: true,
      },
    });

    const totalRatings = ratings.length;
    const averageRating =
      ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;

    const groupedRatings = ratings.reduce((acc: any, curr) => {
      const gigId = curr.gig.id;

      if (!acc[gigId]) {
        acc[gigId] = {
          gig: {
            id: curr.gig.id,
            title: curr.gig.title,
          },
          ratings: [],
          averageRating: 0,
        };
      }

      acc[gigId].ratings.push({
        id: curr.id,
        rating: curr.rating,
      });

      return acc;
    }, {});

    // Calculate average rating for each gig
    Object.keys(groupedRatings).forEach((gigId) => {
      const gigRatings = groupedRatings[gigId].ratings;
      const sum = gigRatings.reduce(
        (total: number, item: { rating: number }) => total + item.rating,
        0
      );
      groupedRatings[gigId].averageRating =
        gigRatings.length > 0 ? sum / gigRatings.length : 0;
    });

    return NextResponse.json(
      { averageRating, ratings: Object.values(groupedRatings) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
