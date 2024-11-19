import prisma from "@/lib/prisma";
import { registerValidationSchema } from "@/lib/validations/auth/register/register-validation-schema";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";
import bcrypt from "bcrypt";
import { UserType } from "@prisma/client";
import { User } from "../../types/api.type";

export async function POST(req: Request) {
  const { email, password, user } = await req.json();

  try {
    await registerValidationSchema.validate(
      { email, password, user },
      { abortEarly: false }
    );

    const newUser = await createUserWithAddresses(user);

    const hashedPassword = await await bcrypt.hash(password, 10);

    const newAccount = await prisma.account.create({
      data: {
        email,
        password: hashedPassword,
        user_id: newUser.id,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      },
      select: {
        id: true,
        email: true,
        user_id: true,
      },
    });

    const profile = await createUserProfile(
      user.user_type,
      newUser.id,
      newUser.name
    );

    return NextResponse.json(
      {
        profile: { ...profile, type: user.user_type },
        account: newAccount,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ erros: [error] }, { status: 500 });
  }
}

const createUserWithAddresses = async (user: User) => {
  const { addresses, contacts, name, user_type } = user;

  const newUser = await prisma.user.create({
    data: {
      name,
      contacts,
      user_type,
      created_by: "unauthorized user",
      updated_by: "unauthorized user",
    },
    select: { id: true, name: true },
  });

  await prisma.address.createMany({
    data: [
      ...addresses.map((address) => ({
        ...address,
        user_id: newUser.id,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      })),
    ],
  });

  return newUser;
};

const createUserProfile = async (
  userType: UserType,
  userId: string,
  name: string
) => {
  if (userType === UserType.ORGANIZER) {
    return await prisma.organizer.create({
      data: {
        first_name: name,
        user_id: userId,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      },
      select: {
        id: true,
      },
    });
  }
  if (userType === UserType.VENDOR) {
    return await prisma.vendor.create({
      data: {
        user_id: userId,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      },
      select: {
        id: true,
      },
    });
  }
  if (userType === UserType.ADMIN) {
    return await prisma.vendor.create({
      data: {
        user_id: userId,
        created_by: "unauthorized user",
        updated_by: "unauthorized user",
      },
      select: {
        id: true,
      },
    });
  }
  return null;
};
