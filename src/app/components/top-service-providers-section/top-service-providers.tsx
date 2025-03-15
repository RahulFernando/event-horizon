"use client";
import React from "react";
import { Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import ProviderCard from "./provider-card";
import { VendorWithRating } from "@/app/api/types/api.type";
import useSWR from "swr";
import ProviderCardSkeleton from "./provider-card-skeleton";

async function fetchTopServiceProviders(
  url: string,
  { arg }: { arg: { top: boolean } }
) {
  const params = new URLSearchParams({ top: `${arg.top}` }).toString();
  const response = await fetch(url + params);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as {
    count: number;
    items: VendorWithRating[];
  };
}

const TopServiceProviders = () => {
  const { isLoading, data: vendors = { count: 0, items: [] } } = useSWR(
    "/api/vendors?",
    (url: string) => fetchTopServiceProviders(url, { arg: { top: true } })
  );

  const getImageUrl = () => {
    const images = [
      "/images/users/man-2.jpg",
      "/images/users/women-2.jpg",
      "/images/users/man-3.jpg",
      "/images/users/women-1.jpg",
      "/images/users/man-1.jpg",
    ];

    return images[Math.floor(Math.random() * images.length)];
  };

  return (
    <Container maxWidth={false} sx={{ mb: 4 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h3" fontWeight={600}>
          Top Service Providers of the Week
        </Typography>
      </Stack>
      <Grid container spacing={1}>
        {isLoading &&
          [1, 2, 3, 4].map((item) => (
            <Grid key={item} size={{ xs: 3 }}>
              <ProviderCardSkeleton />
            </Grid>
          ))}
        {!isLoading &&
          vendors.count > 0 &&
          vendors.items.map(({ id, user, averageRating }) => (
            <Grid key={id} size={{ xs: 12, md: 12 / vendors.items.length }}>
              <ProviderCard
                title={user.name}
                src={getImageUrl()}
                ratings={averageRating}
              />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default TopServiceProviders;
