import { Grid2, Stack, Typography } from "@mui/material";
import React from "react";
import { BasicDetailsProps } from "../../events.type";

const BasicDetails: React.FC<BasicDetailsProps> = ({
  title,
  location,
  description,
}) => (
  <Grid2 container spacing={1}>
    <Grid2 size={{ xs: 12 }}>
      <Stack
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Typography variant="subtitle2">{location}</Typography>
      </Stack>
    </Grid2>
    <Grid2 size={{ xs: 12 }}>
      <Typography variant="body1">{description}</Typography>
    </Grid2>
  </Grid2>
);

export default BasicDetails;
