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

const EventForm: React.FC<EventFormProps> = ({
  errors,
  dateTime,
  isMutating,
  register,
  handleSubmit,
  submitHandler,
  onDateChange,
  reset,
}) => {
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
              {...register("event_type_id")}
            >
              <MenuItem value="234b5430-bf36-4f7b-a8cf-a603aee8d8bb">
                Birth Day
              </MenuItem>
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
          {!isMutating && "Submit"}
          {isMutating && "Pleae wait..."}
        </Button>
      </Stack>
    </form>
  );
};

export default EventForm;
