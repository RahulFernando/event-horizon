"use client";
import React from "react";
import { Grid2 } from "@mui/material";
import AdminLayout from "../components/admin-layout";
import StatisticsCard from "./components/statistics-card";
import { IGig, IJob, IVendor } from "../types";
import useSWR from "swr";
import { Organizer } from "@prisma/client";

async function fetchVendors(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { items: IVendor[]; count: number };
}

async function fetchOrganizers(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { items: Organizer[]; count: number };
}

async function fetchJobs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { items: IJob[]; count: number };
}

async function fetchGigs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { items: IGig[]; count: number };
}

const AdminHomepage = () => {
  const { data: totalJobs = { items: [], count: 0 } } = useSWR(
    "/api/jobs",
    fetchJobs
  );

  const { data: totalGigs = { items: [], count: 0 } } = useSWR(
    "/api/gigs",
    fetchGigs
  );

  const { data: totalVendors = { items: [], count: 0 } } = useSWR(
    "/api/vendors",
    fetchVendors
  );

  const { data: totalOrganizers = { items: [], count: 0 } } = useSWR(
    "/api/organizers",
    fetchOrganizers
  );

  const { count: jobCount } = totalJobs;
  const { count: gigCount } = totalGigs;
  const { count: vendorCount } = totalVendors;
  const { count: organizerCount } = totalOrganizers;

  return (
    <AdminLayout>
      <Grid2 container spacing={2}>
        <Grid2 size={{ sm: 12, md: 4, lg: 3 }}>
          <StatisticsCard
            title="Vendors"
            value={vendorCount}
            icon="/icons/vendor.png"
          />
        </Grid2>
        <Grid2 size={{ sm: 12, md: 4, lg: 3 }}>
          <StatisticsCard
            title="Organizers"
            value={organizerCount}
            icon="/icons/organizer.png"
          />
        </Grid2>
        <Grid2 size={{ sm: 12, md: 4, lg: 3 }}>
          <StatisticsCard title="Gigs" value={gigCount} icon="/icons/gig.png" />
        </Grid2>
        <Grid2 size={{ sm: 12, md: 4, lg: 3 }}>
          <StatisticsCard title="Jobs" value={jobCount} icon="/icons/job.png" />
        </Grid2>
      </Grid2>
    </AdminLayout>
  );
};

export default AdminHomepage;
