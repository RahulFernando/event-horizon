import { Chip } from "@mui/material";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { TicketStatus } from "@prisma/client";

export const getTicketStatusChip = (status: TicketStatus) => {
  switch (status) {
    case "PENDING":
      return (
        <Chip icon={<QueryBuilderIcon />} label="Pending" color="secondary" />
      );
    case "ON_HOLD":
      return (
        <Chip
          icon={<PauseCircleOutlineIcon />}
          label="HoldPending"
          color="warning"
        />
      );
    case "SOLVED":
      return (
        <Chip
          icon={<CheckCircleOutlineIcon />}
          label="Solved"
          color="success"
        />
      );
    case "CLOSED":
      return <Chip icon={<HighlightOffIcon />} label="Closed" color="error" />;

    default:
      return <Chip icon={<HelpOutlineIcon />} label="Open" color="info" />;
  }
};
