"use client";
import React, { useContext } from "react";
import useSWR from "swr";
import { Stack, Typography } from "@mui/material";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { BarChart } from "@mui/x-charts/BarChart";
import { IMonthlyEarning } from "@/app/types";

async function fetchEarning(url: string, token: string) {
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

  return (await response.json()) as IMonthlyEarning[];
}

const MonthlyEarning = () => {
  const { token } = useContext(AuthContext);

  const { data: earnings = [] } = useSWR(
    `/api/vendors/reports/monthly-earning`,
    (url: string) => fetchEarning(url, token as string)
  );

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Typography variant="subtitle1">Your Earnings</Typography>
      <BarChart
        dataset={earnings}
        xAxis={[{ scaleType: "band", dataKey: "month" }]}
        series={[{ dataKey: "earnings", label: "Earnings (Rs.)" }]}
        height={300}
      />
    </Stack>
  );
};

export default MonthlyEarning;
