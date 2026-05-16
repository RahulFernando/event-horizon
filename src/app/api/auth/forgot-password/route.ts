import prisma from "@/lib/prisma";
import { forgotValidationSchema } from "@/lib/validations/auth/forgot-password/forgot-password-validation-schema";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";
import { transporter } from "@/lib/nodemailer";
import { passwordResetHtml } from "@/lib/email-templates/password-reset";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await forgotValidationSchema.validate(body, { abortEarly: false });

    const account = await prisma.account.findFirst({
      where: {
        email: body.email,
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      return NextResponse.json({ errors: ["Invalid email"] }, { status: 404 });
    }

    const isVerified = await transporter.verify();

    if (!isVerified) {
      return NextResponse.json(
        { errors: ["Email service is not available"] },
        { status: 503 },
      );
    }

    const mailOptions = {
      from: '"EventHorizon <eventhorizon.sandbox@gmail.com>"',
      to: account.email,
      subject: "Password Reset Request",
      html: passwordResetHtml({
        userFirstName: account.user.name,
        resetLink: `http://localhost:3000/auth/reset-password?mail=${account.email}`,
      }),
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(info, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.log("Error in forgot password handler:", error);
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}
