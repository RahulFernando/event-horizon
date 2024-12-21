import React from "react";
import { Box, Typography } from "@mui/material";
import { FooterItemProps } from "./footer.types";

const FooterItem: React.FC<FooterItemProps> = ({ title, children }) => (
  <Box
    component="div"
    sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
  >
    <Typography variant="h4">{title}</Typography>
    {children}
  </Box>
);

export default FooterItem;
