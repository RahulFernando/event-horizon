// src/app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAuthUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserName = currentUser.name;
    const { title, participantIds } = await req.json();

    // Make sure the current user is included in participants
    const uniqueParticipantIds = Array.from(
      new Set([currentUser.id, ...participantIds])
    );

    // Validate that all participants exist and are either vendors or organizers
    const participants = await prisma.user.findMany({
      where: {
        id: { in: uniqueParticipantIds },
        user_type: { in: ["VENDOR", "ORGANIZER"] },
      },
    });

    if (participants.length !== uniqueParticipantIds.length) {
      return NextResponse.json(
        { error: "One or more participants are invalid" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        title,
        created_by: currentUserName,
        updated_by: currentUserName,
        participants: {
          create: uniqueParticipantIds.map((userId) => ({
            user_id: userId,
            created_by: currentUserName,
            updated_by: currentUserName,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = currentUser.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: currentUserId,
            is_active: true,
          },
        },
        is_deleted: false,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                user_type: true,
                account: {
                  select: {
                    profile_picture_url: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          orderBy: {
            sent_at: "desc",
          },
          take: 1,
          include: {
            read_receipts: true,
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
