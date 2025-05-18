import React from "react";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BlockIcon from "@mui/icons-material/Block";
import { EventItemProps } from "../events.type";
import dayjs from "dayjs";

const EventItem: React.FC<EventItemProps> = ({
  id,
  title,
  venue,
  date_time,
  enabled,
  onDelete,
  onClick,
}) => {
  const dateTime = dayjs(date_time).format("LLL");
  return (
    <Box
      p={1}
      sx={{
        position: "relative",
        bgcolor: "white",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        borderRadius: 1,
        ":hover": {
          cursor: "pointer",
          boxShadow:
            " rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        },
      }}
      component="div"
      onClick={enabled ? onClick.bind(null, id) : () => {}}
    >
      {!enabled && (
        <Tooltip
          title="Please contact administrator"
          placement="left-start"
          arrow
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <Chip
              label="Disabled"
              size="small"
              color="error"
              icon={<BlockIcon />}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderTopRightRadius: 1,
                pl: 0.5,
                "& .MuiChip-label": {
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        </Tooltip>
      )}
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
            gap: "1px",
            flex: 1,
            opacity: enabled ? 1 : 0.8,
          }}
        >
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2">{venue}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flex: 1,
            opacity: enabled ? 1 : 0.8,
          }}
        >
          <Typography variant="subtitle2" align="left">
            {dateTime}
          </Typography>
        </Box>
        {enabled && (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default EventItem;
