import AppBar from "@/app/components/app-bar";
import { Container, Stack } from "@mui/material";
import Navigation from "./components/navigation";

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
        </Stack>
      </Container>
    </>
  );
};

export default VendorDashboardPage;
