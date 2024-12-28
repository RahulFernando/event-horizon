"use client";
import React from "react";
import { Typography } from "@mui/material";
import { AppTitleProps } from "./app-title.types";
import Link from "next/link";

const AppTitle: React.FC<AppTitleProps> = (props) => {
  return (
    <Typography
      component={Link}
      href="/"
      variant="h2"
      fontWeight={600}
      {...props}
    >
      Event Horizon
    </Typography>
  );
};

export default AppTitle;
