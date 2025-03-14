import React from "react";
import { Grid2, Rating, TextField, Box } from "@mui/material";
import { RateJobProps } from "../events.type";

const RateJob: React.FC<RateJobProps> = ({
  values,
  onRateChange,
  onFeedbackChange,
}) => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Rating value={values.rating} onChange={onRateChange} />
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <TextField
          multiline
          rows={3}
          label="Your Feedback"
          size="small"
          fullWidth
          name="feedback"
          value={values.feedback}
          onChange={onFeedbackChange}
        />
      </Grid2>
    </Grid2>
  );
};

export default RateJob;
