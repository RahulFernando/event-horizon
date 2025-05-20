import { Grid2, TextField } from "@mui/material";
import React from "react";
import { EditableVendorAccountProps } from "../profile.types";

const EditableVendorAccount: React.FC<EditableVendorAccountProps> = ({
  register,
}) => (
  <>
    <Grid2 size={{ xs: 6 }}>
      <TextField
        fullWidth
        size="small"
        label="Business Registration"
        {...register("business_registration")}
      />
    </Grid2>
    <Grid2 size={{ xs: 6 }}>
      <TextField
        fullWidth
        size="small"
        label="TIN"
        {...register("taxpayer_identification_number")}
      />
    </Grid2>
  </>
);

export default EditableVendorAccount;
