import AppBar from "@/app/components/app-bar";
import { Box, Container, Stack } from "@mui/material";
import Navigation from "./components/navigation";
import GigPerformance from "./components/gig-performance";

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
            <GigPerformance />
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default VendorDashboardPage;
