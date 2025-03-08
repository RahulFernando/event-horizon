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
