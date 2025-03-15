"use client";
import React, { useEffect, useState } from "react";
import AppBar from "../components/app-bar";
import { Box, Container, Grid2, TextField } from "@mui/material";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import ProviderCardSkeleton from "../components/top-service-providers-section/provider-card-skeleton";
import ProviderCard from "../components/top-service-providers-section/provider-card";
import { VendorWithRating } from "../api/types/api.type";
import NoData from "../components/no-data";

async function fetchVendors(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as {
    count: number;
    items: VendorWithRating[];
  };
}

const VendorsPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("searchTerm") ?? "";

  const [searchTerm, setSearchTerm] = useState(category);
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { isLoading, data: vendors = { count: 0, items: [] } } = useSWR(
    `/api/vendors?category=${debouncedTerm}`,
    fetchVendors
  );

  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12 }}>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <TextField
                size="small"
                variant="standard"
                label="Search by category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: "20%" }}
              />
            </Box>
          </Grid2>
          <Grid2 container spacing={1} size={{ xs: 12 }}>
            {isLoading &&
              [1, 2, 3, 4].map((item) => (
                <Grid2 key={item} size={{ xs: 3 }}>
                  <ProviderCardSkeleton />
                </Grid2>
              ))}
            {!isLoading &&
              vendors.count > 0 &&
              vendors.items.map(({ id, user, averageRating }) => (
                <Grid2
                  key={id}
                  size={{ xs: 12, md: 12 / vendors.items.length }}
                >
                  <ProviderCard
                    title={user.name}
                    src={"/images/no-picture-available.jpg"}
                    ratings={averageRating}
                  />
                </Grid2>
              ))}
            {!isLoading && vendors.count === 0 && (
              <Grid2 size={{ xs: 12 }}>
                <NoData message="No result for your search term" />
              </Grid2>
            )}
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
};

export default VendorsPage;
