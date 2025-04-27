"use client";
import React, { useContext } from "react";
import { Box } from "@mui/material";
import WhatCustomerThink from "./what-customer-think";
import { IAverageRating } from "../../dashboard.types";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import useSWR from "swr";
import { PieChart } from "@mui/x-charts";

async function fetchAverageRating(url: string, token: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IAverageRating;
}

const AverageRating = () => {
  const { token } = useContext(AuthContext);

  const { isLoading, data: rating = { averageRating: 0, ratings: [] } } =
    useSWR(`/api/vendors/reports/average-rating`, (url: string) =>
      fetchAverageRating(url, token as string)
    );

  const { averageRating = 0, ratings = [] } = rating;

  const data = ratings.map(({ id, gig, averageRating }) => ({
    id,
    value: averageRating,
    label: gig.title,
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WhatCustomerThink isLoading={isLoading} rating={averageRating ?? 0} />
      <PieChart series={[{ data }]} />
    </Box>
  );
};

export default AverageRating;
