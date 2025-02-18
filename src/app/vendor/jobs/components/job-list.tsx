"use client";
import { Grid2 } from "@mui/material";
import JobCard from "./job-card";
import { IVendorJob } from "@/app/types";
import useSWR from "swr";
import { useContext } from "react";
import { AuthContext } from "@/app/contexts/auth/auth-context";

async function fetchJobs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IVendorJob[];
}

const JobList = () => {
  const { account } = useContext(AuthContext);

  const { data: jobs = [] } = useSWR(
    account?.user?.vendors?.id &&
      `/api/vendors/${account?.user?.vendors?.id}/jobs`,
    fetchJobs
  );

  console.log(jobs);

  return (
    <Grid2 container spacing={2}>
      {jobs.map(({ event, ...job }) => (
        <Grid2 key={job.id} size={{ xs: 12 }}>
          <JobCard
            eventName={event.title}
            venue={event.venue}
            id={event.id}
            status={job.status}
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default JobList;
