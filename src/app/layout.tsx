"use client";
import "./globals.css";
import { Nunito_Sans } from "@next/font/google";
import { createTheme } from "./theme";
import { ThemeProvider } from "@mui/material";
import SnackbarProvider from "./contexts/snackbar/snackbar-context";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AuthProvider from "./contexts/auth/auth-context";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme();

  return (
    <html lang="en">
      <body className={nunitoSans.className}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <SnackbarProvider>{children}</SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
