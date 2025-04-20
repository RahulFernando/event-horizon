import React from "react";
import PricingTiers from "@/app/vendor/gigs/components/pricing-tiers";
import { getColorShade } from "@/lib/utils/get-color-shade";
import { indigo } from "@mui/material/colors";
import { Grid2, Typography } from "@mui/material";
import { IPricing } from "@/app/types";
import useSWR from "swr";
import { PricingDetailsProps } from "../../events.type";
import { ITier } from "@/app/vendor/gigs/my-gigs.types";

async function fetchPricing(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IPricing;
}

const PricingDetails: React.FC<PricingDetailsProps> = ({
  id,
  selectedTierId,
  budget,
  onTierSelect,
}) => {
  const { data: pricing } = useSWR(
    id ? `/api/gigs/${id}/pricings?budget=${budget}` : null,
    fetchPricing
  );

  const getTiers = (): ITier[] => {
    if (!pricing || !pricing.tiered) return [];

    const length = pricing.tiered.pricing_tiers.length;

    return pricing.tiered.pricing_tiers.map((tier, index) => ({
      ...tier,
      color: indigo[getColorShade(length, 200) as keyof typeof indigo],
      index,
    }));
  };

  return (
    <Grid2 container spacing={0.5}>
      <Grid2 size={{ xs: 12 }}>
        {pricing && pricing.tiered && (
          <PricingTiers
            tiers={getTiers()}
            selectedTierId={selectedTierId}
            onSelect={onTierSelect}
          />
        )}
        {pricing && (pricing.fixed_rate || pricing?.hourly_rate) && (
          <Typography variant="subtitle1">
            {pricing.hourly_rate && pricing.hourly_rate.hour}{" "}
            <span style={{ fontSize: "12px" }}>Hour</span>
          </Typography>
        )}
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        {pricing && (pricing.fixed_rate || pricing?.hourly_rate) && (
          <Typography variant="subtitle1">
            <span style={{ fontSize: "12px" }}>Rs </span>
            {pricing.hourly_rate && pricing.hourly_rate.price}
            {pricing.fixed_rate && pricing.fixed_rate.price}
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
};

export default PricingDetails;
