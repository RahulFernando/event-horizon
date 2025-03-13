"use client";
import React, { useContext, useEffect } from "react";
import { ChatListProps } from "../chat.types";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import useSWR from "swr";
import { IConversation } from "@/app/types";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";

async function fetchConversations(url: string, token: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IConversation[];
}

const ChatList: React.FC<ChatListProps> = ({ onSelect }) => {
  const { token, account } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const { data: conversations = [], error } = useSWR(
    ["/api/conversations", token],
    ([url, token]) => fetchConversations(url, token as string)
  );

  useEffect(() => {
    if (error) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  }, [error, snackbarToggle]);

  const getTitle = (conversation: IConversation) => {
    if (account) {
      const { user } = account;
      const participantsExceptMe = conversation.participants.filter(
        (p) => p.user_id !== user.id
      );
      return participantsExceptMe[0].user.name;
    }

    return "Untitled Conversation";
  };

  return (
    <List>
      {conversations.map((conversation) => (
        <React.Fragment key={conversation.id}>
          <ListItemButton onClick={onSelect.bind(null, conversation.id)}>
            <ListItemText primary={getTitle(conversation)} />
          </ListItemButton>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default ChatList;
