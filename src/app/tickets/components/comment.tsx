import React, { useContext } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CommentProps } from "../tickets.types";
import dayjs from "dayjs";
import { AuthContext } from "@/app/contexts/auth/auth-context";

const Comment: React.FC<CommentProps> = ({
  id,
  body,
  bgcolor,
  createdBy,
  createdAt,
  onDeleteClick,
}) => {
  const { account } = useContext(AuthContext);

  const isDeleteVisible = account && account.user.name === createdBy;

  return (
    <Paper
      component="div"
      sx={{
        p: 1,
        width: "100%",
        boxSizing: "border-box",
        ...(bgcolor && { bgcolor }),
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1">{body}</Typography>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2">{createdBy}</Typography>
          <Typography variant="body2">
            {dayjs(createdAt).format("LLL")}
          </Typography>
          {isDeleteVisible && (
            <IconButton
              size="small"
              color="error"
              onClick={onDeleteClick.bind(null, id)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default Comment;
