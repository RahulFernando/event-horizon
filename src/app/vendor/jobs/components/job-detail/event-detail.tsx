import React from "react";
import { Grid2, Stack, Typography } from "@mui/material";
import { EventDetailProps } from "../../jobs.types";
import dayjs from "dayjs";

const EventDetail: React.FC<EventDetailProps> = ({
  title,
  venue,
  date_time,
  duration,
}) => {
  const dateTime = dayjs(date_time).format("LLL");

  return (
    <Grid2 container spacing={1}>
      <Grid2 size={{ xs: 6 }}>
        <Stack
          direction="column"
          sx={{ justifyContent: "center", alignItems: "flex-start" }}
        >
          <Typography variant="body2">Title</Typography>
          <Typography variant="subtitle1">{title}</Typography>
        </Stack>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <Stack
          direction="column"
          sx={{ justifyContent: "center", alignItems: "flex-start" }}
        >
          <Typography variant="body2">Venue</Typography>
          <Typography variant="subtitle1">{venue}</Typography>
        </Stack>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <Stack
          direction="column"
          sx={{ justifyContent: "center", alignItems: "flex-start" }}
        >
          <Typography variant="body2">Date & Time</Typography>
          <Typography variant="subtitle1">{dateTime}</Typography>
        </Stack>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <Stack
          direction="column"
          sx={{ justifyContent: "center", alignItems: "flex-start" }}
        >
          <Typography variant="body2">Duration</Typography>
          <Typography variant="subtitle1">
            {duration ? duration : "N/A"}
          </Typography>
        </Stack>
      </Grid2>
    </Grid2>
  );
};

export default EventDetail;
