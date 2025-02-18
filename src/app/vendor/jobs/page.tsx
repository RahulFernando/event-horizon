import AppBar from "@/app/components/app-bar";
import { Box, Container, Stack } from "@mui/material";
import Navigation from "../dashboard/components/navigation";
import ProgressSection from "./components/progress/progress-section";
import JobList from "./components/job-list";

const VendorJobsPage = () => {
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
            <ProgressSection />
            <Box sx={{ mt: 2 }}>
              <JobList />
            </Box>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default VendorJobsPage;
