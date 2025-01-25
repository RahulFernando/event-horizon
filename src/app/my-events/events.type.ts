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

export type EventTab = "event" | "vendor";

export interface EventFormInputs {
  title: string;
  venue?: string;
  date_time: Dayjs | null;
  duration?: string;
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

export type GigCardProps = IGig;
