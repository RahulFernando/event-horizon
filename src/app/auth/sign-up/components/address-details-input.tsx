import React from "react";
import { Grid2 as Grid, TextField } from "@mui/material";

import { Controller } from "react-hook-form";
import { AddressDetailsInputProps } from "../sign-up.types";

const AddressDetailsInput: React.FC<AddressDetailsInputProps> = ({
  addressFields,
  control,
}) => (
  <>
    {addressFields.map((item, index) => (
      <Grid key={item.id} size={{ xs: 12 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 4 }}>
            <Controller
              name={`addresses.${index}.number`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Number"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 8 }}>
            <Controller
              name={`addresses.${index}.line_1`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="Line 1"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Controller
              name={`addresses.${index}.line_2`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Line 2"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Controller
              name={`addresses.${index}.state`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="State"
                  fullWidth
                  required
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Controller
              name={`addresses.${index}.country`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Country"
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Controller
              name={`addresses.${index}.postal_code`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Postal Code"
                  fullWidth
                  required
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    ))}
  </>
);

export default AddressDetailsInput;
