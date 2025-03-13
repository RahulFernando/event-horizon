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

  return (
    <ListItemButton onClick={onClick.bind(this, gig)}>
      <ListItemText
        primary={<JobTitle title={title} status={status} />}
        secondary={name}
      />
      <Tooltip
        title={status === "ACCEPTED" ? "Chat" : "Delete"}
        placement="left-start"
      >
        <IconButton
          edge="end"
          color={status === "ACCEPTED" ? "default" : "error"}
          onClick={
            status === "ACCEPTED" ? chatClickHandler : onDelete.bind(this, id)
          }
        >
          {status === "ACCEPTED" ? <ChatIcon /> : <DeleteOutlineIcon />}
        </IconButton>
      </Tooltip>
    </ListItemButton>
  );
};

export default SelectedGig;
