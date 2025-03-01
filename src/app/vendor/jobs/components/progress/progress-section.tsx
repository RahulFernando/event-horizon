import { Button, Paper, Stack } from "@mui/material";
import ProgressDisplay from "./progress-display";
import { ProgressSectionProps } from "../../jobs.types";

const ProgressSection: React.FC<ProgressSectionProps> = ({
  onCalendarOpen,
}) => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      <ProgressDisplay />
      <Button variant="contained" size="small" onClick={onCalendarOpen}>
        View My Calendar
      </Button>
    </Stack>
  </Paper>
);

export default ProgressSection;
