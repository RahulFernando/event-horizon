import { SelectChangeEvent } from "@mui/material";
import { EventType } from "@prisma/client";
import {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";

export interface GigFormInputs {
  title: string;
  description?: string;
  location: string;
  event_type_ids: string[];
}

export interface GigFormProps {
  eventTypeIds: string[];
  submitBtnLabel?: string;
  isMutating?: boolean;
  eventTypes: EventType[];
  register: UseFormRegister<GigFormInputs>;
  onEventTypesChange: (event: SelectChangeEvent<string[]>) => void;
  handleSubmit: UseFormHandleSubmit<GigFormInputs, undefined>;
  onSubmit: (values: GigFormInputs) => void;
  reset: UseFormReset<GigFormInputs>;
}

export interface GigPostRequestPayload extends GigFormInputs {
  vendor_id: string;
}

export interface GigPreviewProps extends Pick<GigFormInputs, "description"> {
  title?: string;
  location?: string;
  event_types?: string[];
}
