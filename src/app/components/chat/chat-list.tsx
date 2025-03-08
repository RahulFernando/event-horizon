/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge,
  ListItemButton,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useMessages } from "@/app/hooks/use-messages";

const ConversationList: React.FC = () => {
  const {
    conversations,
    activeConversation,
    currentUser,
    setActiveConversation,
    loadMessages,
  } = useMessages();

  const handleConversationClick = (conversation: any) => {
    setActiveConversation(conversation);
    loadMessages(conversation.id);
  };

  const getConversationTitle = (conversation: any) => {
    if (conversation.title) return conversation.title;

    // If no title, use other participants' names
    return conversation.participants
      .filter((p: any) => p.user.id !== currentUser?.id)
      .map((p: any) => p.user.name)
      .join(", ");
  };

  const getLastMessagePreview = (conversation: any) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return "No messages yet";
    }

    const lastMessage = conversation.messages[0];
    const isSender = lastMessage.sender_id === currentUser?.id;
    const prefix = isSender ? "You: " : `${lastMessage.sender.name}: `;

    return `${prefix}${lastMessage.content.substring(0, 30)}${
      lastMessage.content.length > 30 ? "..." : ""
    }`;
  };

  const getLastMessageTime = (conversation: any) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return formatDistanceToNow(new Date(conversation.created_at), {
        addSuffix: true,
      });
    }

    return formatDistanceToNow(new Date(conversation.messages[0].sent_at), {
      addSuffix: true,
    });
  };

  const isUnread = (conversation: any) => {
    if (!conversation.messages || conversation.messages.length === 0)
      return false;

    const lastMessage = conversation.messages[0];
    // Message is unread if it's not from current user and has no read receipt from current user
    return (
      lastMessage.sender_id !== currentUser?.id &&
      !lastMessage.read_receipts.some((r: any) => {
        const participant = conversation.participants.find(
          (p: any) => p.id === r.participant_id
        );
        return participant && participant.user_id === currentUser?.id;
      })
    );
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {conversations.map((conversation) => (
        <React.Fragment key={conversation.id}>
          <ListItemButton
            selected={activeConversation?.id === conversation.id}
            onClick={() => handleConversationClick(conversation)}
            sx={{
              alignItems: "flex-start",
              bgcolor:
                activeConversation?.id === conversation.id
                  ? "action.selected"
                  : "inherit",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ListItemAvatar>
              <Badge
                color="primary"
                variant="dot"
                invisible={!isUnread(conversation)}
              >
                <Avatar
                  alt={getConversationTitle(conversation)}
                  src={
                    conversation.participants.find(
                      (p: any) => p.user.id !== currentUser?.id
                    )?.user.account?.profile_picture_url || ""
                  }
                />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="span"
                  variant="body1"
                  fontWeight={isUnread(conversation) ? "bold" : "regular"}
                >
                  {getConversationTitle(conversation)}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline", mr: 1 }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                    fontWeight={isUnread(conversation) ? "bold" : "regular"}
                  >
                    {getLastMessagePreview(conversation)}
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      mt: 0.5,
                    }}
                  >
                    {getLastMessageTime(conversation)}
                  </Box>
                </React.Fragment>
              }
            />
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
      {conversations.length === 0 && (
        <ListItem>
          <ListItemText primary="No conversations yet" />
        </ListItem>
      )}
    </List>
  );
};

export default ConversationList;
