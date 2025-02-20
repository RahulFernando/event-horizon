"use client";
import { Grid2 } from "@mui/material";
import JobCard from "./job-card";
import { JobListProps } from "../jobs.types";

const JobList: React.FC<JobListProps> = ({ jobs, onClick }) => {
  return (
    <Grid2 container spacing={2}>
      {jobs.map(({ event, ...job }) => (
        <Grid2 key={job.id} size={{ xs: 12 }}>
          <JobCard
            eventName={event.title}
            venue={event.venue}
            id={job.id}
            status={job.status}
            onClick={onClick}
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default JobList;
