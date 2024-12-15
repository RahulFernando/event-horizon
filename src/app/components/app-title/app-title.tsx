"use client";
import React from "react";
import { Typography } from "@mui/material";
import { AppTitleProps } from "./app-title.types";

const AppTitle: React.FC<AppTitleProps> = (props) => {
  return (
    <Typography variant="h2" fontWeight={600} {...props}>
      Event Horizon
    </Typography>
  );
};

export default AppTitle;
