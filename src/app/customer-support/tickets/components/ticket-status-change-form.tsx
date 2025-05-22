import React from "react";
import {
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TicketStatus } from "@prisma/client";

interface TicketStatusChangeFormProps {
  currentStatus: TicketStatus;
  onChange: (event: SelectChangeEvent) => void;
}

const TicketStatusChangeForm: React.FC<TicketStatusChangeFormProps> = ({
  currentStatus,
  onChange,
}) => (
  <Grid2 container spacing={1} mt={2}>
    <Grid2 size={{ xs: 12 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Status</InputLabel>
        <Select
          id="demo-simple-select"
          value={currentStatus}
          label="Status"
          onChange={onChange}
        >
          {[
            { label: "Open", value: TicketStatus.OPEN },
            { label: "Pending", value: TicketStatus.PENDING },
            { label: "Hold", value: TicketStatus.ON_HOLD },
            { label: "Solved", value: TicketStatus.SOLVED },
            { label: "Closed", value: TicketStatus.CLOSED },
          ].map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid2>
  </Grid2>
);

export default TicketStatusChangeForm;
