import { LinearProgressProps } from "@mui/material";
import { JobStatus } from "@prisma/client";

export interface JobProgressProps extends LinearProgressProps {
  value: number;
}

export interface JobCardProps {
  id: string;
  eventName: string;
  venue: string | null;
  status: JobStatus;
}
