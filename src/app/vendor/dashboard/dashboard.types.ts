import { IGig } from "@/app/types";
import { SvgIconComponent } from "@mui/icons-material";

export interface MenuItemProps {
  icon: SvgIconComponent;
  text: string;
  href: string;
}

export interface IGigPerformance {
  id: string;
  title: string;
  totalJobs: number;
  completedJobs: number;
  completionRate: string;
  earnings: number;
}

export interface IRating {
  id: string;
  ratings: { id: string; rating: number };
  gig: IGig;
  averageRating: number;
}

export interface IAverageRating {
  averageRating: number | null;
  ratings?: IRating[];
}

export interface WhatCustomerThinkProps {
  rating: number;
  isLoading?: boolean;
}
