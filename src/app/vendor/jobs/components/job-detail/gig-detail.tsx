import React from "react";
import { Grid2, Stack, Typography } from "@mui/material";
import { GigDetailProps } from "../../jobs.types";
import { FixedRate, HourlyRate } from "@prisma/client";

function isHourlyRate(
  model: FixedRate | HourlyRate | null
): model is HourlyRate {
  return model !== null && "hour" in model;
}

const GigDetail: React.FC<GigDetailProps> = ({
  title,
  pricingTier,
  pricingModel,
}) => {
  console.log(pricingTier);
  const getPrice = () => {
    if (pricingTier) {
      return pricingTier.price;
    }

    if (pricingModel && isHourlyRate(pricingModel)) {
      return pricingModel.price;
    }

    return pricingModel?.price;
  };

  return (
    <Grid2 container spacing={1}>
      <Grid2 size={{ xs: 6 }}>
        <Stack
          direction="column"
          sx={{ justifyContent: "center", alignItems: "flex-start" }}
        >
          <Typography variant="body2">Title</Typography>
          <Typography variant="subtitle1">{title}</Typography>
        </Stack>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <Stack
          direction="column"
          sx={{ justifyContent: "center", alignItems: "flex-start" }}
        >
          <Typography variant="body2">Price</Typography>
          <Typography variant="subtitle1">{getPrice()}</Typography>
        </Stack>
      </Grid2>
    </Grid2>
  );
};

export default GigDetail;
