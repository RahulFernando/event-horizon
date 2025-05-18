import React, { useState } from "react";
import { IGig, IPricing } from "@/app/types";
import useSWR from "swr";

import { GigDetailProps, TabValue } from "../gigs.types";
import { Box, Grid2, Tab, Typography } from "@mui/material";
import { indigo } from "@mui/material/colors";
import LabelWithValue from "../../events/components/label-with-value";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ITier } from "@/app/vendor/gigs/my-gigs.types";
import { getColorShade } from "@/lib/utils/get-color-shade";
import PricingTiers from "@/app/vendor/gigs/components/pricing-tiers";

async function fetchGig(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Failed to update vendor");
  }

  return (await response.json()) as IGig;
}

async function fetchPricing(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IPricing;
}

const GigDetail: React.FC<GigDetailProps> = ({ id }) => {
  const [value, setValue] = useState<TabValue>("basic");

  const { data: gig } = useSWR(`/api/gigs/${id}`, fetchGig);
  const { data: pricing } = useSWR(
    id ? `/api/gigs/${id}/pricings` : null,
    fetchPricing
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue as TabValue);
  };

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
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Basic" value="basic" />
          <Tab label="Pricing" value="pricing" />
        </TabList>
      </Box>
      <TabPanel value="basic">
        <Grid2 spacing={1} container>
          <Grid2 size={{ xs: 12, md: 6 }} container spacing={1}>
            <Grid2 size={{ xs: 12 }}>
              <LabelWithValue
                label="Description"
                value={gig?.description ?? "----"}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <LabelWithValue label="Category" value={gig?.category.name} />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <LabelWithValue label="location" value={gig?.location} />
            </Grid2>
          </Grid2>
        </Grid2>
      </TabPanel>
      <TabPanel value="pricing">
        <Grid2 container spacing={0.5}>
          <Grid2 size={{ xs: 12 }}>
            {pricing && pricing.tiered && <PricingTiers tiers={getTiers()} />}
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
      </TabPanel>
    </TabContext>
  );
};

export default GigDetail;
