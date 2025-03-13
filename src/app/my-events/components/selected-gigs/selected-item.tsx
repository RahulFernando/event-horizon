import React from "react";
import { IconButton, ListItem, ListItemText, Tooltip } from "@mui/material";
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
  onDelete,
}) => {
  const router = useRouter();

  const chatClickHandler = () => router.push("/chat");

  return (
    <ListItem
      secondaryAction={
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
      }
    >
      <ListItemText
        primary={<JobTitle title={title} status={status} />}
        secondary={name}
      />
    </ListItem>
  );
};

export default SelectedGig;
