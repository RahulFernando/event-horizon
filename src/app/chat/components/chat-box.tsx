"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatBoxProps } from "../chat.types";
import { IMessage } from "@/app/types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { AuthContext } from "@/app/contexts/auth/auth-context";
// import { getSocket } from "@/lib/socket";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  List,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import MessageItem from "./message-item";
import { SendIcon } from "lucide-react";

const fetchMessages = async (url: string, token: string) => {
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
  return (await response.json()) as IMessage[];
};

const createMessage = async (
  url: string,
  token: string,
  { args }: { args: { content: string } }
) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }
  return (await response.json()) as IMessage[];
};

const ChatBox: React.FC<ChatBoxProps> = ({ conversationId }) => {
  const { token, account } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);
  const theme = useTheme();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const {
    data: messages = [],
    error,
    mutate,
    isLoading,
  } = useSWR(
    conversationId
      ? [`/api/conversations/${conversationId}/messages`, token]
      : null,
    ([url, token]) => fetchMessages(url, token as string),
    {
      refreshInterval: 5000, // 5 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const { trigger: sendMessage, isMutating } = useSWRMutation(
    conversationId ? `/api/conversations/${conversationId}/messages` : null,
    (url: string, { arg }: { arg: { content: string } }) =>
      createMessage(url, token as string, { args: arg }),
    {
      onSuccess: () => {
        mutate();
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
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (account && account.user.id) {
      setCurrentUserId(account.user.id);
    }
  }, [account]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return;

    sendMessage({ content: newMessage });
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        sx={{
          flex: 1,
          overflowY: "auto",
          marginBottom: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.4),
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={30} />
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              flexDirection: "column",
              p: 3,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No messages yet
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Start a conversation by sending a message
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 1 }}>
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.sender.id === currentUserId}
              />
            ))}
            <div ref={messageEndRef} />
          </List>
        )}
      </Paper>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          padding: 2,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          placeholder="Type a message"
          variant="outlined"
          multiline
          maxRows={4}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={isMutating || !newMessage.trim()}
          sx={{
            marginLeft: 2,
            minWidth: "auto",
            borderRadius: 2,
            height: 40,
            width: 40,
            padding: 0,
          }}
        >
          {isMutating ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
