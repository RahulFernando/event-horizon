"use client";
import React from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

import { RoleSelectionProps } from "../sign-up.types";

const RoleSelection: React.FC<RoleSelectionProps> = ({
  userType,
  ...props
}) => (
  <RadioGroup row name="user-type" value={userType} {...props}>
    <FormControlLabel value="ORGANIZER" control={<Radio />} label="Organizer" />
    <FormControlLabel value="VENDOR" control={<Radio />} label="Vendor" />
  </RadioGroup>
);

export default RoleSelection;
