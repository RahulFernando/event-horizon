import React from "react";
import {
  Box,
  Paper,
  ListItem,
  Typography,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import { IMessage } from "@/app/types";

const MessageItem: React.FC<{ message: IMessage; isCurrentUser: boolean }> = ({
  message,
  isCurrentUser,
}) => {
  const theme = useTheme();

  console.log(isCurrentUser);

  return (
    <ListItem
      sx={{
        flexDirection: "column",
        alignItems: isCurrentUser ? "flex-end" : "flex-start",
        padding: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 0.5,
        }}
      >
        <Avatar
          sx={{
            width: 28,
            height: 28,
            marginRight: 1,
            bgcolor: isCurrentUser
              ? theme.palette.primary.main
              : theme.palette.grey[500],
          }}
        >
          {message.sender.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="body2" color="text.secondary">
          {message.sender.name}
        </Typography>
      </Box>
      <Paper
        elevation={1}
        sx={{
          padding: 1.5,
          maxWidth: "80%",
          borderRadius: 2,
          backgroundColor: isCurrentUser
            ? alpha(theme.palette.primary.main, 0.1)
            : theme.palette.background.default,
          borderColor: isCurrentUser
            ? theme.palette.primary.main
            : theme.palette.divider,
          borderWidth: 1,
          borderStyle: "solid",
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {message.content}
        </Typography>
      </Paper>
    </ListItem>
  );
};

export default MessageItem;
