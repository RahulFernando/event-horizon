import React from "react";
import { Box, IconButton, Paper, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TicketCardProps } from "../tickets.types";
import dayjs from "dayjs";
import { TicketStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

const ICONS = {
  [TicketStatus.OPEN]: "/icons/ticket-status/question-mark.png",
  [TicketStatus.PENDING]: "/icons/ticket-status/pending.png",
  [TicketStatus.ON_HOLD]: "/icons/ticket-status/pause.png",
  [TicketStatus.SOLVED]: "/icons/ticket-status/ok.png",
  [TicketStatus.CLOSED]: "/icons/ticket-status/cancel.png",
};

const TicketCard: React.FC<TicketCardProps> = ({
  id,
  title,
  status,
  createdAt,
  onDeleteClick,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const timeStamp = dayjs(createdAt).format("LLL");

  const clickHandler = () => router.push(`tickets/${id}`);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        width: "100%",
        boxSizing: "border-box",
        "&:hover": {
          boxShadow: theme.shadows[5],
          cursor: "pointer",
        },
      }}
      component="div"
      onClick={clickHandler}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Image
            src={ICONS[status as keyof typeof ICONS]}
            width={32}
            height={32}
            alt="ok"
          />
          <Box
            component="div"
            sx={{ display: "flex", flexDirection: "column", gap: 0 }}
          >
            <Typography variant="h5">{title}</Typography>
            <Typography variant="subtitle2">{timeStamp}</Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          color="error"
          disabled={status !== "OPEN"}
          onClick={onDeleteClick.bind(this, id)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default TicketCard;
