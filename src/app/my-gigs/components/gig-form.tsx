import React from "react";
import {
  Button,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { GigFormProps } from "../my-gigs.types";

const GigForm: React.FC<GigFormProps> = ({
  eventTypeIds,
  submitBtnLabel = "Submit",
  isMutating,
  eventTypes,
  onEventTypesChange,
  register,
  handleSubmit,
  onSubmit,
  reset,
}) => {
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            label="Title"
            required
            {...register("title", { required: "Title is required" })}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Description"
            {...register("description")}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            label="Location"
            required
            {...register("location", { required: "Location" })}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="event-types">Event Types</InputLabel>
            <Select
              labelId="event-types"
              id="demo-multiple-name"
              multiple
              value={eventTypeIds}
              onChange={onEventTypesChange}
              input={<OutlinedInput label="Event Types" />}
            >
              {eventTypes.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
      </Grid2>
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

export default GigForm;
