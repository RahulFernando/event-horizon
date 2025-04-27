"use client";
import AppBar from "@/app/components/app-bar";
import { Box, Container, Grid2, Stack } from "@mui/material";
import Navigation from "./components/navigation";
import GigPerformance from "./components/gig-performance";
import MonthlyEarning from "./components/monthly-earning";
import AverageRating from "./components/average-rating";

const VendorDashboardPage = () => {
  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Navigation />
          <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12 }}>
                <GigPerformance />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <MonthlyEarning />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <AverageRating />
              </Grid2>
            </Grid2>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default VendorDashboardPage;
