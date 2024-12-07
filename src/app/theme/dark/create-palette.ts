import { Palette, createTheme } from "@mui/material/styles";
import { getPrimary, getSecondary } from "../utils";

export const createPalette = (): Palette => {
  const defaultTheme = createTheme();

  return {
    ...defaultTheme.palette,
    background: {
      default: "#171719",
      paper: "#1B1B1C",
    },
    action: {
      ...defaultTheme.palette.action,
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      disabled: "rgba(255, 255, 255, 0.3)",
    },
    divider: "#F2F4F7",
    mode: "dark",
    primary: getPrimary("dark"),
    secondary: getSecondary("dark"),
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
    neutral: {
      main: "#7C7B84",
      light: "#96959c",
      dark: "#C6C6C6",
      contrastText: "FFFFFF",
    },
  };
};
