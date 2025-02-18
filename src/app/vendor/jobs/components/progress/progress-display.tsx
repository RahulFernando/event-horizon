import { Box, Stack, Typography } from "@mui/material";
import JobProgressBar from "./job-progress-bar";

const ProgressDisplay = () => (
  <Stack
    direction="row"
    spacing={2}
    sx={{ justifyContent: "flex-start", alignItems: "center" }}
  >
    <Typography variant="body1">Progress</Typography>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ width: "200px" }}>
        <JobProgressBar variant="determinate" value={50} />
      </Box>
      <Typography variant="body2">50%</Typography>
    </Stack>
  </Stack>
);

export default ProgressDisplay;
