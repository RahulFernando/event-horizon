"use client";
import { Grid2 as Grid } from "@mui/material";
import React from "react";
import GigCard from "./gig-card";
import { GigListProps, IGig } from "../events.type";
import useSWR from "swr";

async function fetchGigs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { count: number; items: IGig[] };
}

const GigList: React.FC<GigListProps> = ({
  eventType,
  dateTime,
  onClick,
  onAddClick,
}) => {
  const searchParams = new URLSearchParams({
    eventType: eventType ?? "",
    dateTime: dateTime ?? "",
  });

  const { data: gigs = { count: 0, items: [] } } = useSWR(
    `/api/gigs?${searchParams}`,
    fetchGigs
  );

  return (
    <Grid container spacing={2}>
      {gigs.items.map((gig) => (
        <Grid key={gig.id} size={{ xs: 12, md: 4, xl: 3 }}>
          <GigCard {...gig} onClick={onClick} onAddClick={onAddClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default GigList;
