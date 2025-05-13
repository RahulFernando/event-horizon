import { IEventType } from "@/app/types";

export interface EventDetailProps {
  id: string;
}

export interface LabelWithValueProps {
  label: string;
  value: string | React.ReactNode;
}

export interface EventTypesProps {
  eventType: IEventType;
}
