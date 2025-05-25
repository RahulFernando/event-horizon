import React, { useEffect } from "react";
import PricingTiers from "@/app/vendor/gigs/components/pricing-tiers";
import { getColorShade } from "@/lib/utils/get-color-shade";
import { indigo } from "@mui/material/colors";
import { Grid2, InputAdornment, TextField, Typography } from "@mui/material";
import { IPricing } from "@/app/types";
import useSWR from "swr";
import { PricingDetailsProps } from "../../events.type";
import { ITier } from "@/app/vendor/gigs/my-gigs.types";
import { useParams } from "next/navigation";

async function fetchPricing(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { pricingModel: IPricing };
}

const PricingDetails: React.FC<PricingDetailsProps> = ({
  id,
  selectedTierId,
  budget,
  duration,
  onTierSelect,
  durationChangeHandler,
  setAccessToAddJob,
}) => {
  const params = useParams();

  const { data: pricing } = useSWR(
    id
      ? `/api/gigs/${id}/pricings?budget=${budget}&eventId=${params.id}`
      : null,
    fetchPricing
  );

  const isHourlyRate = pricing && pricing.pricingModel.hourly_rate;

  useEffect(() => {
    if (
      pricing &&
      (pricing.pricingModel.hourly_rate ||
        pricing.pricingModel.fixed_rate ||
        (pricing.pricingModel.tiered &&
          pricing.pricingModel.tiered.pricing_tiers.length > 0))
    ) {
      setAccessToAddJob(true);
    } else {
      setAccessToAddJob(false);
    }
  }, [pricing, setAccessToAddJob]);

  const getTiers = (): ITier[] => {
    if (!pricing || !pricing.pricingModel.tiered) return [];

    const length = pricing.pricingModel.tiered.pricing_tiers.length;

    return pricing.pricingModel.tiered.pricing_tiers.map((tier, index) => ({
      ...tier,
      color: indigo[getColorShade(length, 200) as keyof typeof indigo],
      index,
    }));
  };

  return (
    <Grid2 container spacing={0.5}>
      <Grid2 size={{ xs: 12 }}>
        {pricing && pricing.pricingModel.tiered && (
          <PricingTiers
            tiers={getTiers()}
            selectedTierId={selectedTierId}
            onSelect={onTierSelect}
          />
        )}
        {pricing &&
          (pricing.pricingModel.fixed_rate ||
            pricing.pricingModel?.hourly_rate) && (
            <Typography variant="subtitle1">
              {pricing.pricingModel.hourly_rate &&
                pricing.pricingModel.hourly_rate.hour}{" "}
              <span style={{ fontSize: "12px" }}>Hour</span>
            </Typography>
          )}
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        {pricing &&
          (pricing.pricingModel.fixed_rate ||
            pricing.pricingModel?.hourly_rate) && (
            <Typography variant="subtitle1">
              <span style={{ fontSize: "12px" }}>Rs </span>
              {pricing.pricingModel.hourly_rate &&
                pricing.pricingModel.hourly_rate.price}
              {pricing.pricingModel.fixed_rate &&
                pricing.pricingModel.fixed_rate.price}
            </Typography>
          )}
      </Grid2>
      {isHourlyRate && (
        <Grid2 size={{ xs: 12 }} sx={{ mt: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Duration"
            type="number"
            value={duration ?? ""}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">hrs</InputAdornment>
                ),
              },
            }}
            onChange={durationChangeHandler}
          />
        </Grid2>
      )}
    </Grid2>
  );
};

export default PricingDetails;
