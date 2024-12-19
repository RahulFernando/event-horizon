import React from "react";
import { Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import ProviderCard from "./provider-card";

const providers = [
  { name: "John Doe", src: "/images/users/man-2.jpg", ratings: 3 },
  { name: "Jane Smith", src: "/images/users/women-2.jpg", ratings: 4 },
  {
    name: "Michael Brown",
    src: "/images/users/man-3.jpg",
    ratings: 3.6,
  },
  {
    name: "Emily Davis",
    src: "/images/users/women-1.jpg",
    ratings: 3.3,
  },
  {
    name: "David Clark",
    src: "/images/users/man-1.jpg",
    ratings: 4.7,
  },
];

const TopServiceProviders = () => {
  return (
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
          Top Service Providers of the Week
        </Typography>
      </Stack>
      <Grid container spacing={1}>
        {providers.map(({ name, ...provider }) => (
          <Grid key={name} size={{ xs: 12, md: 12 / providers.length }}>
            <ProviderCard title={name} {...provider} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TopServiceProviders;
