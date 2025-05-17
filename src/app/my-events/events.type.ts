/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectChangeEvent } from "@mui/material";
import { Dayjs } from "dayjs";
import {
  // Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { IEventTypeOnGig, IVendor } from "../types";
import React from "react";

export type EventTab = "event" | "vendor";

export interface EventFormInputs {
  title: string;
  venue?: string;
  date_time: Dayjs | null;
  duration?: string;
  budget: number;
  event_type_id: string;
  organizer_id?: string;
}

export interface EventFormProps {
  errors: FieldErrors<EventFormInputs>;
  dateTime: Dayjs | null;
  isMutating: boolean;
  eventTypeId: string | undefined;
  submitBtnLabel?: string;
  // control: Control<EventFormInputs, any>;
  register: UseFormRegister<EventFormInputs>;
  handleSubmit: UseFormHandleSubmit<EventFormInputs, undefined>;
  submitHandler: (values: EventFormInputs) => void;
  onDateChange: (value: Dayjs | null) => void;
  reset: UseFormReset<EventFormInputs>;
  onEventTypeChange: (value: SelectChangeEvent) => void;
}

export interface EventItemProps {
  id: string;
  title: string;
  venue: string | null;
  date_time: Date;
  enabled: boolean;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export interface FilterToolbarProps {
  searchTerm?: string;
  dateTime?: string;
  onSearchTermChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onDateTimeChange: (event: SelectChangeEvent) => void;
}

export interface GigListProps {
  eventType?: string;
  dateTime?: string;
  onClick: (id: string, event: React.MouseEvent) => void;
  onAddClick: (id: string, event: React.MouseEvent) => void;
}

export interface IGig {
  id: string;
  title: string;
  description: string;
  location: string;
  blob_url?: string;
  event_types: IEventTypeOnGig[];
  vendor: IVendor;
}

export interface GigCardProps extends IGig {
  onClick: (id: string, event: React.MouseEvent) => void;
  onAddClick: (id: string, event: React.MouseEvent) => void;
}

export interface GigDetailsProps {
  id: string | undefined;
  selectedTierId?: string;
  budget?: string;
  onTierSelect?: (id: string, event: React.MouseEvent) => void;
}

export interface BasicDetailsProps {
  id?: string;
  title?: string;
  description?: string | null;
  location?: string;
}

export interface PricingDetailsProps extends GigDetailsProps {
  selectedTierId?: string;
}

export interface JobFormProps {
  gig_id: string;
  event_id: string;
  pricing_tier_id?: string;
  pricing_tier_tiered_id?: string;
}

export interface RatingFormValues {
  feedback: string;
  rating: number;
}

export interface RateJobProps {
  values: RatingFormValues;
  onFeedbackChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onRateChange: (event: React.SyntheticEvent, value: number | null) => void;
}

export type PaymentType = "FULL" | "ADVANCE";

export interface PaymentProps {
  jobId: string;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}
