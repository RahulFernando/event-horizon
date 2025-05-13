import React from "react";
import { Grid2 } from "@mui/material";
import LabelWithValue from "./label-with-value";
import { EventDetailProps } from "../events.types";
import { IEvent } from "@/app/types";
import useSWR from "swr";
import dayjs from "dayjs";

async function fetchEvent(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Failed to update vendor");
  }

  return (await response.json()) as IEvent;
}

const EventDetail: React.FC<EventDetailProps> = ({ id }) => {
  const { data: event } = useSWR(`/api/events/${id}`, fetchEvent);

  const date = event && dayjs(event.date_time).format("LLL");

  const duration = event && event.duration + " hrs";

  return (
    <Grid2 spacing={1} container>
      <Grid2 size={{ xs: 12, md: 6 }} container spacing={1}>
        <Grid2 size={{ xs: 12 }}>
          <LabelWithValue
            label="Date & Time"
            value={date ?? "-- --, ----, -:-- --"}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <LabelWithValue label="Duration" value={duration ?? "N/A"} />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <LabelWithValue label="Venue" value={event?.venue ?? "----"} />
        </Grid2>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }} container spacing={1}>
        <Grid2 size={{ xs: 12 }}>
          <LabelWithValue label="Budget" value={event?.budget ?? "N/A"} />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <LabelWithValue
            label="Event Types"
            value={event?.event_type ? event?.event_type.name : "----"}
          />
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default EventDetail;
