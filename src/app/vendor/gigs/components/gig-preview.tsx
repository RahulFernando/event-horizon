"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BlockIcon from "@mui/icons-material/Block";
import { GigPreviewProps } from "../my-gigs.types";
import { GIG_PREVIEW } from "../constants";

const GigPreview: React.FC<GigPreviewProps> = ({
  id,
  title = GIG_PREVIEW["title"],
  description = GIG_PREVIEW["description"],
  location = GIG_PREVIEW["location"],
  event_types = GIG_PREVIEW["event_types"],
  enabled = true,
  cardHeight = "200px",
  onClick,
  onDeleteClick,
}) => (
  <Box
    component="div"
    onClick={onClick && id && enabled ? onClick.bind(null, id) : () => {}}
    sx={{ position: "relative", height: cardHeight }}
  >
    <Card
      sx={{
        height: "100%",
        position: "relative",
        transition: "all 0.2s ease-in-out",
        ":hover": {
          cursor: enabled ? "pointer" : "default",
          ...(onClick && { boxShadow: 5 }),
        },
      }}
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
              top: 12,
              right: 0,
              zIndex: 1,
            }}
          >
            <Chip
              label="Disabled"
              size="small"
              color="error"
              icon={<BlockIcon fontSize="small" />}
              sx={{
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                pl: 0.5,
                "& .MuiChip-label": {
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        </Tooltip>
      )}
      <CardHeader
        title={title}
        subheader={location}
        action={
          onDeleteClick &&
          enabled && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={onDeleteClick.bind(this, {
                  id: id as string,
                  title: title as string,
                })}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )
        }
      />
      <CardContent
        sx={{
          flexGrow: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description.length > 100
            ? `${description.slice(0, 100)}...`
            : description}
        </Typography>
        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {event_types.map((eventType) => (
            <Chip key={eventType} color="default" label={eventType} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  </Box>
);

export default GigPreview;
