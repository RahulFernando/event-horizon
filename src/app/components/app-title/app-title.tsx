"use client";
import { alpha, Typography } from "@mui/material";

export default function AppTitle() {
  return (
    <Typography variant="h1">
      Event{" "}
      <span style={{ color: alpha("#FF00AA", 0.7), fontStyle: "italic" }}>
        Horizon
      </span>
    </Typography>
  );
}
