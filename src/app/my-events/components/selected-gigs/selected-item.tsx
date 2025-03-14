import React from "react";
import {
  IconButton,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChatIcon from "@mui/icons-material/Chat";
import { SelectedGigItemProps } from "./selected-gigs.types";
import JobTitle from "./job-title";
import { useRouter } from "next/navigation";
import { JobStatus } from "@prisma/client";

const SelectedGig: React.FC<SelectedGigItemProps> = ({
  title,
  name,
  id,
  status = "ACCEPTED",
  gig,
  onDelete,
  onClick,
}) => {
  const router = useRouter();

  const chatClickHandler = () => router.push("/chat");

  const statusArray: JobStatus[] = ["ACCEPTED", "COMPLETED"];

  const isDeleteAllow = !statusArray.includes(status);

  return (
    <ListItemButton onClick={onClick.bind(this, gig, id)}>
      <ListItemText
        primary={<JobTitle title={title} status={status} />}
        secondary={name}
      />
      <Tooltip
        title={!isDeleteAllow ? "Chat" : "Delete"}
        placement="left-start"
      >
        <IconButton
          edge="end"
          color={status === "ACCEPTED" ? "default" : "error"}
          onClick={!isDeleteAllow ? chatClickHandler : onDelete.bind(this, id)}
        >
          {!isDeleteAllow ? <ChatIcon /> : <DeleteOutlineIcon />}
        </IconButton>
      </Tooltip>
    </ListItemButton>
  );
};

export default SelectedGig;
