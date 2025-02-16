/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Box, Typography } from "@mui/material";
import { NoDataProps } from "./no-data.types";

const NoData: React.FC<NoDataProps> = ({
  message,
  height = 250,
  width = 280,
}) => (
  <Box
    component="div"
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div>
      <img src="/images/empty.png" alt="empty" width={width} height={height} />
    </div>
    <Typography variant="body1">{message}</Typography>
  </Box>
);

export default NoData;
