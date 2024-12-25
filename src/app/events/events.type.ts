import { Dayjs } from "dayjs";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";

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
  register: UseFormRegister<EventFormInputs>;
  handleSubmit: UseFormHandleSubmit<EventFormInputs, undefined>;
  submitHandler: (values: EventFormInputs) => void;
  onDateChange: (value: Dayjs | null) => void;
  reset: UseFormReset<EventFormInputs>;
}
