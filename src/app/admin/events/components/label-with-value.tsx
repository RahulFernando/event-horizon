import React from "react";
import { Stack, Typography } from "@mui/material";
import { LabelWithValueProps } from "../events.types";

const LabelWithValue: React.FC<LabelWithValueProps> = ({ label, value }) => {
  const getValue = () => {
    if (typeof value === "string") {
      return <Typography variant="body1">{value}</Typography>;
    }

    return value;
  };
  return (
    <Stack
      spacing={0.2}
      direction="column"
      sx={{ justifyContent: "center", alignItems: "flex-start" }}
    >
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      {getValue()}
    </Stack>
  );
};

export default LabelWithValue;
