// src/app/api/conversations/[conversationId]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getAuthUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = params;
    const currentUserId = currentUser.id;

    // Verify the user is a participant in this conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id: currentUserId,
          conversation_id: conversationId,
        },
        is_active: true,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Access denied to this conversation" },
        { status: 403 }
      );
    }

    // Get pagination parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const before = url.searchParams.get("before");

    // Fetch messages with pagination
    const messages = await prisma.message.findMany({
      where: {
        conversation_id: conversationId,
        is_deleted: false,
        ...(before ? { sent_at: { lt: new Date(before) } } : {}),
      },
      include: {
        sender: {
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
        read_receipts: true,
      },
      orderBy: {
        sent_at: "asc",
      },
      take: limit,
    });

    // Mark unread messages as read
    await prisma.$transaction(
      messages
        .filter(
          (message) =>
            !message.read_receipts.some(
              (receipt) => receipt.participant_id === participant.id
            )
        )
        .map((message) =>
          prisma.readReceipt.create({
            data: {
              message_id: message.id,
              participant_id: participant.id,
            },
          })
        )
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getAuthUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = params;
    const { content } = await req.json();
    const currentUserName = currentUser.name;

    // Verify the user is a participant in this conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id: currentUser.id,
          conversation_id: conversationId,
        },
        is_active: true,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Access denied to this conversation" },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversation_id: conversationId,
        sender_id: currentUser.id,
        content,
        created_by: currentUserName,
        updated_by: currentUserName,
      },
      include: {
        sender: {
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
    });

    // Update the conversation's updated_at timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updated_at: new Date(), updated_by: currentUserName },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
