import { Box, Stack, Typography } from "@mui/material";
import JobProgressBar from "./job-progress-bar";
import { ProgressDisplayProps } from "../../jobs.types";

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  percentage = 0,
}) => (
  <Stack
    direction="row"
    spacing={2}
    sx={{ justifyContent: "flex-start", alignItems: "center" }}
  >
    <Typography variant="body1">Progress</Typography>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ width: "200px" }}>
        <JobProgressBar variant="determinate" value={percentage} />
      </Box>
      <Typography variant="body2">{percentage}%</Typography>
    </Stack>
  </Stack>
);

export default ProgressDisplay;
