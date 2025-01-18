import { Grid2 } from "@mui/material";
import React from "react";
import { PricingTiersProps } from "../../my-gigs.types";
import TierCard from "./tier-card";

const PricingTiers: React.FC<PricingTiersProps> = ({ tiers = [] }) => {
  return (
    <Grid2 container spacing={1}>
      {tiers.map((tier) => (
        <Grid2 key={tier.level} size={{ xs: 12, md: 4, xl: 3 }}>
          <TierCard {...tier} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default PricingTiers;
