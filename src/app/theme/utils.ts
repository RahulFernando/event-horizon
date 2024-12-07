import { alpha, getContrastRatio, PaletteColor } from "@mui/material";

const greenBase = "#00ff55";
const greenMain = alpha(greenBase, 0.7);

const greenDarBase = "#005e2f";
const greenDarMain = alpha(greenDarBase, 0.7);

const pinkBase = "#FF00AA";
const pinkMain = alpha(pinkBase, 0.7);

const purpleBase = "#2c003e";
const purpleMain = alpha(purpleBase, 0.7);

export const getPrimary = (mode: string = "light"): PaletteColor => {
  if (mode === "dark") {
    return {
      main: greenDarMain,
      light: alpha(greenDarBase, 0.5),
      dark: alpha(greenDarBase, 0.9),
      contrastText:
        getContrastRatio(greenDarBase, "#fff") > 4.5 ? "#fff" : "#111",
    };
  }

  return {
    main: greenMain,
    light: alpha(greenBase, 0.5),
    dark: alpha(greenBase, 0.9),
    contrastText: getContrastRatio(greenBase, "#fff") > 4.5 ? "#fff" : "#111",
  };
};

export const getSecondary = (mode: string = "light"): PaletteColor => {
  if (mode === "dark") {
    return {
      main: purpleMain,
      light: alpha(purpleBase, 0.5),
      dark: alpha(purpleBase, 0.9),
      contrastText:
        getContrastRatio(purpleBase, "#fff") > 4.5 ? "#fff" : "#111",
    };
  }

  return {
    main: pinkMain,
    light: alpha(pinkBase, 0.5),
    dark: alpha(pinkBase, 0.9),
    contrastText: getContrastRatio(pinkBase, "#fff") > 4.5 ? "#fff" : "#111",
  };
};
