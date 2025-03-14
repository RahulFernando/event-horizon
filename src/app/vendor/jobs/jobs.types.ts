import { IGig } from "@/app/types";
import { LinearProgressProps } from "@mui/material";
import { Event, FixedRate, HourlyRate, Job, JobStatus } from "@prisma/client";

export interface JobProgressProps extends LinearProgressProps {
  value: number;
}

export interface JobCardProps {
  id: string;
  eventName: string;
  venue: string | null;
  status: JobStatus;
  onClick: (id: string) => void;
}

export interface JobListProps {
  jobs: IVendorJob[];
  onClick: (id: string) => void;
}

export interface JobDetailProps {
  id: string;
}

export type EventDetailProps = Event;

export interface GigDetailProps extends IGig {
  pricingTier?: {
    id: string;
    level: string;
    description: string;
    price: number;
  };
  pricingModel: FixedRate | HourlyRate | null;
}

export interface IVendorJob extends Job {
  gig: IGig;
  event: Event;
  pricingTier?: {
    id: string;
    level: string;
    description: string;
    price: number;
  };
  priceModel: FixedRate | HourlyRate | null;
}

export interface DialogFooterProps {
  isLoading?: boolean;
  onSubmit: (value: JobStatus) => void;
  onClose: () => void;
}

export interface ProgressSectionProps {
  onCalendarOpen: () => void;
}

export interface IPercentage {
  vendor_id: number;
  total_jobs: number;
  completed_jobs: number;
  completion_percentage: string;
}

export interface ProgressDisplayProps {
  percentage?: number;
}
