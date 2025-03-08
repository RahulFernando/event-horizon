/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = "GlP+yjGxHGI=";

interface JwtPayload {
  sub: string;
  email: string;
  aud: string;
  iss: string;
  exp: number;
}

export async function getAuthUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userId = decoded.sub;

    const account = await prisma.account.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        user: {
          select: {
            id: true,
            name: true,
            user_type: true,
          },
        },
      },
    });

    if (!account) {
      return null;
    }

    return {
      id: account.user.id,
      email: account.email,
      name: account.user.name,
      userType: account.user.user_type,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

// Middleware to protect API routes
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<Response>
) {
  const user = await getAuthUser(req);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return handler(req, user);
}
