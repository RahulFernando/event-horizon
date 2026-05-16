import prisma from "@/lib/prisma";
import { resetPasswordValidationSchema } from "@/lib/validations/auth/reset-password/reset-password-schema";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { password, email } = await req.json();

  try {
    await resetPasswordValidationSchema.validate(
      {
        password,
      },
      { abortEarly: false },
    );

    const account = await prisma.account.findUnique({
      where: { email: email },
      include: { user: true },
    });

    if (!account) {
      return NextResponse.json(
        { errors: ["Account with the provided email does not exist"] },
        { status: 404 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.account.update({
      where: { email: email },
      data: {
        password: hashedPassword,
        updated_by: account.user.name,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
