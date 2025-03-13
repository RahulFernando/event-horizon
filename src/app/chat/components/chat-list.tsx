"use client";
import React, { useContext, useEffect } from "react";
import { ChatListProps } from "../chat.types";
import {
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import useSWR from "swr";
import { IConversation } from "@/app/types";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import useSWRMutation from "swr/mutation";

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

async function deleteConversation(
  url: string,
  token: string,
  { args }: { args: { id: string } }
) {
  const response = await fetch(`/api/conversations/${args.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

const ChatList: React.FC<ChatListProps> = ({ onSelect }) => {
  const { token, account } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const {
    data: conversations = [],
    error,
    mutate,
  } = useSWR(["/api/conversations", token], ([url, token]) =>
    fetchConversations(url, token as string)
  );

  const { isMutating, trigger: removeConversation } = useSWRMutation(
    "/api/conversation",
    (url: string, { arg }: { arg: { id: string } }) =>
      deleteConversation(url, token as string, { args: arg }),
    {
      onSuccess: () => {
        mutate();
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Conversation deleted successfully",
          severity: "success",
        });
      },
    }
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

  useEffect(() => {
    if (isMutating) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isMutating, snackbarToggle]);

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

  const deleteHandler = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeConversation({ id });
  };

  return (
    <List>
      {conversations.map((conversation) => (
        <React.Fragment key={conversation.id}>
          <ListItemButton onClick={onSelect.bind(null, conversation.id)}>
            <ListItemText primary={getTitle(conversation)} />
            <IconButton
              color="error"
              onClick={deleteHandler.bind(this, conversation.id)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </ListItemButton>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default ChatList;
