/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { updateUserValidationSchema } from "@/lib/validations/users/update-user-validation";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

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
        account: {
          select: {
            email: true,
          },
        },
        organizers: true,
        vendors: true,
      },
    });
    return NextResponse.json({ ...user }, { status: 200 });
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await updateUserValidationSchema.validate(body, { abortEarly: false });

    const { addresses, ...payload } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...payload,
        updated_by: currentUser.name,
      },
    });

    await syncAddresses(addresses, id, currentUser.name);

    if (updatedUser.user_type === "ORGANIZER") {
      const { name, addresses, contacts, ...rest } = body;
      await updateOrganizer(rest, updatedUser.id, currentUser.name);
    }

    if (updatedUser.user_type === "VENDOR") {
      const { name, addresses, contacts, ...rest } = body;
      await updateVendor(rest, updatedUser.id, currentUser.name);
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

const updateOrganizer = async (body: any, userId: string, userName: string) => {
  await prisma.organizer.update({
    where: {
      user_id: userId,
    },
    data: {
      ...body,
      updated_by: userName,
    },
  });
};

const updateVendor = async (body: any, userId: string, userName: string) => {
  await prisma.vendor.update({
    where: {
      user_id: userId,
    },
    data: {
      ...body,
      updated_by: userName,
    },
  });
};

const syncAddresses = async (
  addresses: any[],
  userId: string,
  userName: string
) => {
  const existingAddresses = await prisma.address.findMany({
    where: {
      user_id: userId,
    },
  });

  const incomingIds = addresses
    .map((addr) => addr.addressId)
    .filter((id) => id !== undefined && id !== null);

  const addressesToDelete = existingAddresses
    .filter((addr) => !incomingIds.includes(addr.id))
    .map((addr) => addr.id);

  return await prisma.$transaction(async (tx) => {
    // 1. Delete addresses that are no longer in the array
    if (addressesToDelete.length > 0) {
      await tx.address.deleteMany({
        where: {
          id: {
            in: addressesToDelete,
          },
        },
      });
    }

    const results = [];

    for (const address of addresses) {
      const { addressId, ...addressRest } = address;
      if (addressId) {
        // Try to update existing address
        const updated = await tx.address.update({
          where: {
            id: addressId,
          },
          data: {
            ...addressRest,
            updated_by: userName,
          },
        });
        results.push(updated);
      } else {
        const created = await tx.address.create({
          data: {
            ...addressRest,
            user_id: userId,
            created_by: userName,
            updated_by: userName,
          },
        });
        results.push(created);
      }
    }

    return {
      updated: results,
      deleted: addressesToDelete.length,
    };
  });
};

const updateOrCreateAddresses = async (
  addresses: any[],
  userId: string,
  userName: string
) => {
  return await Promise.all(
    addresses.map(async (address) => {
      const { addressId, ...d } = address;
      if (!addressId) {
        return await prisma.address.create({
          data: {
            ...d,
            user_id: userId,
            created_by: userName,
            updated_by: userName,
          },
        });
      }

      return await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          ...d,
          updated_by: userName,
        },
      });
    })
  );
};
