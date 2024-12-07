"use client";

import Grid from "@mui/material/Grid2";
import { Box, ThemeProvider } from "@mui/material";
import ImageCarousel from "./sign-in/components/image-carousel";

import { createTheme } from "../theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={0} sx={{ height: "100%" }}>
        <Grid size={{ xl: 4, md: 5, xs: 12 }}>{children}</Grid>
        <Grid size={{ xl: 8, md: 7, xs: 12 }}>
          <Box
            component="div"
            sx={{ width: "100%", height: "100%", position: "fixed" }}
          >
            <ImageCarousel />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
