"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid2,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GigPreviewProps } from "../my-gigs.types";
import { GIG_PREVIEW } from "../constants";

const GigPreview: React.FC<GigPreviewProps> = ({
  id,
  title = GIG_PREVIEW["title"],
  description = GIG_PREVIEW["description"],
  location = GIG_PREVIEW["location"],
  event_types = GIG_PREVIEW["event_types"],
  md = 4,
  xs = 12,
  onClick,
  onDeleteClick,
}) => (
  <Box
    component="div"
    onClick={onClick && id ? onClick.bind(null, id) : () => {}}
  >
    <Card>
      <CardHeader
        title={title}
        subheader={location}
        action={
          onDeleteClick && (
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
      <CardContent>
        <Typography variant="body1">{description}</Typography>
        <Grid2 container spacing={0.5} mt={2}>
          {event_types.map((eventType) => (
            <Grid2 key={eventType} size={{ xs, md }}>
              <Chip key={eventType} color="default" label={eventType} />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  </Box>
);

export default GigPreview;
