"use client";
import React, { useContext } from "react";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import useSWR from "swr";
import { Box, Chip, ChipOwnProps, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import getPerformanceLabelAndColor from "../utils/get-performance-chip-label-and-color";
import { IGigPerformance } from "../dashboard.types";
import GridToolbar from "./grid-toolbar";

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "totalJobs",
    headerName: "Total Jobs",
    flex: 1,
  },
  {
    field: "completedJobs",
    headerName: "Completed Jobs",
    flex: 1,
  },
  {
    field: "completionRate",
    headerName: "Completion Rate",
    flex: 1,
  },
  {
    field: "earnings",
    headerName: "Earnings",
    flex: 1,
  },
  {
    field: "performance",
    headerName: "Performance",
    flex: 1,
    renderCell: (params: GridRenderCellParams<IGigPerformance>) => {
      const { label, color } = getPerformanceLabelAndColor(
        params.row.completionRate
      );

      return <Chip label={label} color={color as ChipOwnProps["color"]} />;
    },
  },
];

async function fetchGigPerformance(url: string, token: string) {
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

  return (await response.json()) as IGigPerformance[];
}

const GigPerformance = () => {
  const { token } = useContext(AuthContext);

  const { isLoading: performanceLoading, data: performance = [] } = useSWR(
    `/api/vendors/reports/gig-performance`,
    (url: string) => fetchGigPerformance(url, token as string)
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
      <Typography variant="subtitle1">Your Gig Performance</Typography>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          loading={performanceLoading}
          rows={performance}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Stack>
  );
};

export default GigPerformance;
