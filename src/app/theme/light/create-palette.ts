import { common } from "@mui/material/colors";
import { Palette, createTheme } from "@mui/material/styles";
import { getPrimary, getSecondary } from "../utils";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }
}

export const createPalette = (): Palette => {
  const defaultTheme = createTheme();

  return {
    ...defaultTheme.palette,
    background: {
      default: common.white,
      paper: common.white,
    },
    divider: "#F2F4F7",
    mode: "light",
    primary: getPrimary(),
    secondary: getSecondary(),
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    neutral: {
      main: "#7C7B84",
      light: "#96959c",
      dark: "#56565c",
      contrastText: "FFFFFF",
    },
  };
};
