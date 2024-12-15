"use client";
import "./globals.css";
import { Nunito_Sans } from "@next/font/google";
import { createTheme } from "./theme";
import { ThemeProvider } from "@mui/material";
import SnackbarProvider from "./contexts/snackbar/snackbar-context";
import AppBar from "./components/app-bar";

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
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <AppBar />
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
