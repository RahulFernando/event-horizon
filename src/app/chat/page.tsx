"use client";
import React, { useState } from "react";
import SnackBar from "../components/snack-bar";
import AppBar from "../components/app-bar";
import { Container, Grid2, Paper, Typography } from "@mui/material";
import ChatList from "./components/chat-list";
import ChatBox from "./components/chat-box";

const ChatPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState("");

  const conversationSelectHandler = (id: string) =>
    setSelectedConversationId(id);

  return (
    <>
      <SnackBar />
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 4 }}>
            <Paper sx={{ height: "100vh", padding: 2 }}>
              <Typography variant="h6">Conversations</Typography>
              <ChatList onSelect={conversationSelectHandler} />
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 8 }}>
            {selectedConversationId && (
              <ChatBox conversationId={selectedConversationId} />
            )}
            {!selectedConversationId && (
              <Typography variant="subtitle1">
                Select a conversation to start chatting
              </Typography>
            )}
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
};

export default ChatPage;
