"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { GigPreviewProps } from "../my-gigs.types";
import { GIG_PREVIEW } from "../constants";

const GigPreview: React.FC<GigPreviewProps> = ({
  title = GIG_PREVIEW["title"],
  description = GIG_PREVIEW["description"],
  location = GIG_PREVIEW["location"],
  event_types = GIG_PREVIEW["event_types"],
}) => (
  <Card>
    <CardHeader title={title} subheader={location} />
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
);

export default GigPreview;
