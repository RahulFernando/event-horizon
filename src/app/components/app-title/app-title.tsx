"use client";
import { alpha, Typography } from "@mui/material";

export default function AppTitle() {
  return (
    <Typography variant="h1">
      Event <span style={{ color: alpha("#44AB96", 0.7) }}>Horizon</span>
    </Typography>
  );
}
