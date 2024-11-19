import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { loginValidationSchema } from "@/lib/validations/auth/login/login-validation-schema";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    await loginValidationSchema.validate(body, { abortEarly: false });

    const account = await findAccountByEmail(body.email);

    if (!account) {
      return NextResponse.json(
        { message: "Incorrect email address" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      account.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    const token = await generateJsonWebToken(account.id, account.email);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...accountDetails } = account;

    return NextResponse.json(
      { token, account: accountDetails },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

const findAccountByEmail = async (email: string) => {
  return await prisma.account.findUnique({
    where: { email: email },
    select: {
      id: true,
      email: true,
      password: true,
      profile_picture_url: true,
      user: {
        select: {
          id: true,
          user_type: true,
          name: true,
        },
      },
    },
  });
};

const generateJsonWebToken = async (id: string, email: string) =>
  await jwt.sign(
    { sub: id, aud: "event-horizon-client", email: email },
    "GlP+yjGxHGI=",
    { issuer: "event-horizon", expiresIn: "1h", algorithm: "HS256" }
  );
