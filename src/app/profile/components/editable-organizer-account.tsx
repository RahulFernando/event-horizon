import { Grid2, TextField } from "@mui/material";
import React from "react";
import { EditableOrganizerAccountProps } from "../profile.types";

const EditableOrganizerAccount: React.FC<EditableOrganizerAccountProps> = ({
  register,
  errors,
}) => (
  <>
    <Grid2 size={{ xs: 6, md: 3 }}>
      <TextField
        fullWidth
        size="small"
        label="First Name"
        required
        {...register("first_name", { required: "First Name is required" })}
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
      />
    </Grid2>
    <Grid2 size={{ xs: 6, md: 3 }}>
      <TextField
        fullWidth
        size="small"
        label="Last Name"
        {...register("last_name")}
      />
    </Grid2>
    <Grid2 size={{ xs: 6 }}>
      <TextField
        fullWidth
        size="small"
        label="NIC"
        {...register("national_identity")}
      />
    </Grid2>
  </>
);

export default EditableOrganizerAccount;
