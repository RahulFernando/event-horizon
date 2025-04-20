"use client";
import React from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { EventFormProps } from "../events.type";
import { DateTimePicker } from "@mui/x-date-pickers";
import useSWR from "swr";
import { EventType } from "@prisma/client";

async function fetchEventTypes(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as EventType[];
}

const EventForm: React.FC<EventFormProps> = ({
  errors,
  dateTime,
  isMutating,
  eventTypeId,
  submitBtnLabel = "Submit",
  onEventTypeChange,
  register,
  handleSubmit,
  submitHandler,
  onDateChange,
  reset,
}) => {
  const { data = [] } = useSWR("/api/event-types", fetchEventTypes);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Title"
            size="small"
            fullWidth
            required
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Venue"
            size="small"
            fullWidth
            required
            {...register("venue")}
            error={!!errors.venue}
            helperText={errors.venue?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <DateTimePicker
            label="Date and Time"
            value={dateTime}
            onChange={onDateChange}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                required: true,
                error: !!errors.date_time,
                helperText: errors.date_time?.message,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Duration in Hours"
            size="small"
            fullWidth
            {...register("duration")}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Your Budget"
            size="small"
            type="number"
            fullWidth
            required
            {...register("budget", { required: "Budget is required" })}
            error={!!errors.budget}
            helperText={errors.budget?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl
            required
            size="small"
            fullWidth
            error={!!errors.event_type_id}
          >
            <InputLabel id="event-type">Event Type</InputLabel>
            <Select
              labelId="event-type"
              label="Event Type"
              value={eventTypeId}
              onChange={onEventTypeChange}
            >
              <MenuItem disabled value={undefined}>
                <em>Select</em>
              </MenuItem>
              {data.map((eventType) => (
                <MenuItem key={eventType.id} value={eventType.id}>
                  {eventType.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.event_type_id?.message}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Button variant="outlined" size="small" onClick={() => reset()}>
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={isMutating}
        >
          {!isMutating && submitBtnLabel}
          {isMutating && "Pleae wait..."}
        </Button>
      </Stack>
    </form>
  );
};

export default EventForm;
