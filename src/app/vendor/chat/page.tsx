"use client";
import React, { useState } from "react";
import { Container, Grid2, Paper, Stack, Typography, Box } from "@mui/material";
import SnackBar from "@/app/components/snack-bar";
import AppBar from "@/app/components/app-bar";
import ChatList from "@/app/chat/components/chat-list";
import ChatBox from "@/app/chat/components/chat-box";
import Navigation from "../dashboard/components/navigation";
import AuthGuard from "@/app/guards/auth-guard";

const ChatPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState("");

  const conversationSelectHandler = (id: string) =>
    setSelectedConversationId(id);

  return (
    <AuthGuard userType="VENDOR">
      <SnackBar />
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Navigation />
          <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 4 }}>
                <Paper sx={{ height: "73vh", padding: 2 }}>
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
          </Box>
        </Stack>
      </Container>
    </AuthGuard>
  );
};

export default ChatPage;
