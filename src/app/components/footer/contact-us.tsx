import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const ContactUs = () => {
  return (
    <Box
      component="div"
      sx={{ display: "flex", flexDirection: "column", gap: "8px", mt: 2 }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ justifyContent: "flex-start", alignItems: "center" }}
      >
        <Typography variant="body1">Email:</Typography>
        <Typography variant="body1">support@horizon.com</Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{ justifyContent: "flex-start", alignItems: "center" }}
      >
        <Typography variant="body1">Phone:</Typography>
        <Typography variant="body1">+94 71 123 4567</Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{ justifyContent: "flex-start", alignItems: "center" }}
      >
        <Typography variant="body1">Address:</Typography>
        <Typography variant="body1">
          No. 42, Park Avenue, Colombo 03, Sri Lanka
        </Typography>
      </Stack>
    </Box>
  );
};

export default ContactUs;
