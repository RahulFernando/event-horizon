import { getAuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getAuthUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;

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

    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log("Error deleting conversation:", JSON.stringify(error));
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
