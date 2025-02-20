import { Button, Paper, Stack } from "@mui/material";
import ProgressDisplay from "./progress-display";

const ProgressSection = () => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      <ProgressDisplay />
      <Button variant="contained" size="small">
        View My Calendar
      </Button>
    </Stack>
  </Paper>
);

export default ProgressSection;
