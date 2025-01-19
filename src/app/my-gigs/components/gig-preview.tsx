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
import { GigPreviewProps } from "../my-gigs.types";
import { GIG_PREVIEW } from "../constants";

const GigPreview: React.FC<GigPreviewProps> = ({
  id,
  title = GIG_PREVIEW["title"],
  description = GIG_PREVIEW["description"],
  location = GIG_PREVIEW["location"],
  event_types = GIG_PREVIEW["event_types"],
  isActions,
  onClick,
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
          isActions && (
            <Tooltip title="Delete">
              <IconButton size="small" color="error">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )
        }
      />
      <CardContent>
        <Typography variant="body1">{description}</Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
            mt: 2,
          }}
        >
          {[
            event_types.map((eventType) => (
              <Chip key={eventType} color="default" label={eventType} />
            )),
          ]}
        </Stack>
      </CardContent>
    </Card>
  </Box>
);

export default GigPreview;
