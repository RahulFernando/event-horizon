import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { EventItemProps } from "../events.type";
import dayjs from "dayjs";

const EventItem: React.FC<EventItemProps> = ({
  id,
  title,
  venue,
  date_time,
  onDelete,
}) => {
  const dateTime = dayjs(date_time).format("LLL");
  return (
    <Box
      p={1}
      sx={{
        bgcolor: "white",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        ":hover": {
          boxShadow:
            " rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "2px",
            flex: 1,
          }}
        >
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body1">{venue}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flex: 1,
          }}
        >
          <Typography variant="subtitle2" align="left">
            {dateTime}
          </Typography>
        </Box>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={onDelete.bind(null, id)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default EventItem;
