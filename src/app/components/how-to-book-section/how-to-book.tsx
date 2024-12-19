import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import Step from "./step";

const steps = [
  {
    label: "Create an Event",
    description:
      "Start by setting up the details of your event, including the date, location, and type of occasion. This will serve as the foundation for selecting the right service providers.",
  },
  {
    label: "Search for Providers",
    description:
      "Explore a wide range of service providers based on your event needs, such as catering, entertainment, or décor. Filter by category, location, and availability to find the perfect fit.",
  },
  {
    label: "Assign Selected Providers",
    description:
      "Once you’ve found a provider, assign them to your event with a simple click. You can then coordinate further details to ensure a smooth and successful collaboration.",
  },
];

const HowToBook = () => (
  <Container maxWidth={false} sx={{ mb: 4 }}>
    <Stack
      direction="row"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography variant="h3" fontWeight={600}>
        How to Book Providers through Event Horizon
      </Typography>
    </Stack>
    <Stack
      direction="row"
      sx={{
        mt: 6,
        justifyContent: "space-between",
        alignItems: "center",
      }}
      spacing={2}
    >
      {steps.map((step, index) => (
        <Step key={step.label} step={++index} {...step} />
      ))}
    </Stack>
  </Container>
);

export default HowToBook;
