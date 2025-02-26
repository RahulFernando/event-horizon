import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import { JobTitleProps } from "./selected-gigs.types";
import { getChipColor } from "@/app/vendor/jobs/utils/get-chip-color";
import { toTitleCase } from "@/lib/utils/to-title-case";
import { JobStatus } from "@prisma/client";

const JobTitle: React.FC<JobTitleProps> = ({ title, status }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="body1" sx={{ mr: 1 }}>
        {title}
      </Typography>
      <Chip
        color={getChipColor(status as JobStatus)}
        variant="filled"
        size="small"
        label={toTitleCase(status as JobStatus)}
      />
    </Box>
  );
};

export default JobTitle;
