import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { getChipColor } from "../utils/get-chip-color";
import { JobCardProps } from "../jobs.types";
import { toTitleCase } from "@/lib/utils/to-title-case";

const JobCard: React.FC<JobCardProps> = ({
  id,
  eventName,
  venue,
  status,
  onClick,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack
        direction="row"
        spacing={8}
        sx={{ justifyContent: "flex-start", alignItems: "center" }}
      >
        <Stack direction="column" spacing={0}>
          <Typography variant="h6">{eventName}</Typography>
          <Typography variant="body2">{venue}</Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={3}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <Stack direction="column" spacing={0} sx={{ alignItems: "center" }}>
            <Typography variant="h6">Status</Typography>
            <Chip
              color={getChipColor(status)}
              variant="filled"
              size="small"
              label={toTitleCase(status)}
            />
          </Stack>
          <Stack direction="row" spacing={0} sx={{ alignItems: "center" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={onClick.bind(null, id)}
            >
              View
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default JobCard;
