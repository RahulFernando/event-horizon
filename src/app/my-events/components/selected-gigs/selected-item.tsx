import React from "react";
import { IconButton, ListItem, ListItemText, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { SelectedGigItemProps } from "./selected-gigs.types";
import JobTitle from "./job-title";

const SelectedGig: React.FC<SelectedGigItemProps> = ({
  title,
  name,
  id,
  status = "PENDING",
  onDelete,
}) => (
  <ListItem
    secondaryAction={
      <Tooltip title="Delete" placement="left-start">
        <IconButton edge="end" color="error" onClick={onDelete.bind(this, id)}>
          <DeleteOutlineIcon />
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

export default SelectedGig;
