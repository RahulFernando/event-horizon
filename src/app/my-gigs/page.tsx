"use client";
import React from "react";
import AppBar from "../components/app-bar";
import { Button, Container, Grid2, Stack } from "@mui/material";
import Link from "next/link";
import { IVendorGigs } from "../types";
import useSWR from "swr";
import GigPreview from "./components/gig-preview";
import { useRouter } from "next/navigation";
import GigItemSkeleton from "./components/gig-item-skeleton";

async function fetchGigs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IVendorGigs;
}

const MyGigsPage = () => {
  const router = useRouter();

  const { isLoading, data: gigs = { count: 0, items: [] } } = useSWR(
    `/api/vendors/pf3b75c5-7765-4c45-8c23-8066e7326100/gigs`,
    fetchGigs
  );

  const clickHandler = (id: string) =>
    router.push(`/my-gigs/${id}?activeTab=basic`);

  const myGigs = gigs.items.map(
    ({ id, title, description, location, event_types }) => ({
      id,
      title,
      description: description ?? "",
      location,
      event_types: event_types.map((type) => type.event_type.name),
    })
  );

  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <FilterToolbar
            {...filters}
            onSearchTermChange={searchTermChangeHandler}
            onDateTimeChange={dateTimeChangeHandler}
          /> */}
          <Button
            variant="contained"
            LinkComponent={Link}
            href="/my-gigs/create"
          >
            New Gig
          </Button>
        </Stack>
        <Grid2 container spacing={2} mt={4}>
          {isLoading &&
            [3, 4, 5, 6].map((gig) => <GigItemSkeleton key={gig} />)}
          {!isLoading &&
            myGigs.map((gig) => (
              <Grid2 key={gig.id} size={{ xs: 12, md: 4, lg: 3 }}>
                <GigPreview isActions {...gig} onClick={clickHandler} />
              </Grid2>
            ))}
        </Grid2>
      </Container>
    </>
  );
};

export default MyGigsPage;
