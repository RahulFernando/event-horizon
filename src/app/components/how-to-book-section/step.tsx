import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { StepProps } from "./how-to-book.types";

const Step: React.FC<StepProps> = ({ step, label, description }) => {
  return (
    <Stack
      direction="column"
      spacing={3}
      sx={{
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "150px",
          width: "150px",
          borderRadius: "50%",
          backgroundColor: "primary.main",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" color="white">
          {step}
        </Typography>
      </Box>
      <Stack
        direction="column"
        spacing={1}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">{label}</Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Step;
