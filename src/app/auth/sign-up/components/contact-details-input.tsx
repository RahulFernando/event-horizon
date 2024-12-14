import React from "react";
import { Grid2 as Grid, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Controller } from "react-hook-form";
import { ContactDetailsInputProps } from "../sign-up.types";

const ContactDetailsInput: React.FC<ContactDetailsInputProps> = ({
  control,
  contactFields,
  error,
  errorMessage,
  onAppend,
  onRemove,
}) => (
  <>
    {contactFields.map((item, index) => (
      <Grid key={item.id} size={{ xs: 12 }}>
        <Grid container spacing={0.5}>
          <Grid size={{ xs: 11 }}>
            <Controller
              name={`contacts.${index}.phone`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required={index === 0 && true}
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!error}
                  helperText={errorMessage}
                />
              )}
              rules={{
                required: index === 0 ? "Phone number is required" : false,
              }}
            />
          </Grid>
          <Grid size={{ xs: 1 }}>
            {index === 0 && (
              <IconButton size="small" onClick={onAppend}>
                <AddIcon />
              </IconButton>
            )}
            {index > 0 && (
              <IconButton
                color="error"
                size="small"
                onClick={onRemove.bind(null, index)}
              >
                <RemoveIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Grid>
    ))}
  </>
);

export default ContactDetailsInput;
