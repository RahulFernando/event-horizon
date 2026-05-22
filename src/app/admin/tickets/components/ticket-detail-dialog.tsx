"use client";
import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { ITicket, ITicketComment } from "@/app/types";
import { TicketStatus } from "@prisma/client";
import useSWR, { mutate } from "swr";
import Transition from "@/app/components/dialog/transition";
import { AuthContext } from "@/app/contexts/auth/auth-context";

interface TicketDetailDialogProps {
  open: boolean;
  ticket: ITicket | null;
  onClose: () => void;
}

const STATUS_COLOR: Record<
  TicketStatus,
  "default" | "warning" | "info" | "success" | "error"
> = {
  OPEN: "error",
  PENDING: "warning",
  ON_HOLD: "info",
  SOLVED: "success",
  CLOSED: "default",
};

async function fetchComments(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return (await res.json()) as { items: ITicketComment[]; count: number };
}

const TicketDetailDialog: React.FC<TicketDetailDialogProps> = ({
  open,
  ticket,
  onClose,
}) => {
  const { token } = useContext(AuthContext);

  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const commentsKey = ticket ? `/api/tickets/${ticket.id}/comments` : null;

  const { data: commentsData, isLoading: loadingComments } = useSWR(
    open ? commentsKey : null,
    fetchComments,
  );

  const handleSubmitComment = async () => {
    if (!ticket || !commentBody.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`/api/tickets/${ticket.id}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: commentBody.trim() }),
      });
      setCommentBody("");
      mutate(commentsKey);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCommentBody("");
    onClose();
  };

  if (!ticket) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" component="span" sx={{ flex: 1 }}>
            {ticket.title}
          </Typography>
          <Chip
            label={ticket.status}
            color={STATUS_COLOR[ticket.status]}
            size="small"
          />
        </Box>
        {ticket.user && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Submitted by {ticket.user.name}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {ticket.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Description
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "pre-wrap" }}
            >
              {ticket.description}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Comments ({commentsData?.count ?? 0})
        </Typography>

        {loadingComments ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : commentsData?.items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No comments yet.
          </Typography>
        ) : (
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}
          >
            {commentsData?.items.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  p: 1.5,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="caption" fontWeight={600}>
                    {comment.created_by}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {comment.body}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Add a comment"
            multiline
            minRows={3}
            fullWidth
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            disabled={submitting}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmitComment}
          disabled={!commentBody.trim() || submitting}
        >
          {submitting ? <CircularProgress size={20} /> : "Submit Comment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDetailDialog;
