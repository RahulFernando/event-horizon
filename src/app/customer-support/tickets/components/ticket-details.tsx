import React from "react";
import LabelWithValue from "@/app/admin/events/components/label-with-value";
import { Box, Grid2, TextField, Typography } from "@mui/material";
import { ITicket } from "@/app/types";
import { TicketComment } from "@prisma/client";
import Comment from "@/app/tickets/components/comment";
import { grey } from "@mui/material/colors";

interface TicketDetailsProps extends ITicket {
  comment: string;
  comments: TicketComment[];
  onCommentChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCommentSubmit: () => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  comments,
  title,
  description,
  comment,
  onCommentChange,
}) => (
  <>
    <Grid2 container spacing={1}>
      <Grid2 size={{ xs: 4 }}>
        <LabelWithValue label="Title" value={title} />
      </Grid2>
      <Grid2 size={{ xs: 8 }}>
        <LabelWithValue label="Description" value={description ?? ""} />
      </Grid2>
    </Grid2>
    <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1" color="primary">
        Comments
      </Typography>
      {comments.map(({ id, body, created_by, created_at }) => (
        <Comment
          key={id}
          id={id}
          body={body}
          createdAt={created_at}
          createdBy={created_by}
          bgcolor={grey[100]}
          onDeleteClick={() => {}}
        />
      ))}
      <TextField
        size="small"
        multiline
        rows={2}
        fullWidth
        label="Comment"
        required
        value={comment}
        onChange={onCommentChange}
      />
    </Box>
  </>
);

export default TicketDetails;
