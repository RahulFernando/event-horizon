import { alpha, getContrastRatio, PaletteColor } from "@mui/material";

const englishRedBase = "#AB4459";
const englishRedMain = alpha(englishRedBase, 0.7);

const englishRedDarkBase = "#cc7f8f";
const englishRedDarkMain = alpha(englishRedDarkBase, 0.7);

const oceanGreenBase = "#44AB96";
const oceanGreenMain = alpha(oceanGreenBase, 0.7);

const oceanGreenDarkBase = "#5bbeaa";
const oceanGreenDarkMain = alpha(oceanGreenDarkBase, 0.7);

export const getPrimary = (mode: string = "light"): PaletteColor => {
  if (mode === "dark") {
    return {
      main: englishRedDarkMain,
      light: alpha(englishRedDarkBase, 0.5),
      dark: alpha(englishRedDarkBase, 0.9),
      contrastText:
        getContrastRatio(englishRedDarkBase, "#fff") > 4.5 ? "#fff" : "#111",
    };
  }

  return {
    main: englishRedMain,
    light: alpha(englishRedBase, 0.5),
    dark: alpha(englishRedBase, 0.9),
    contrastText:
      getContrastRatio(englishRedBase, "#fff") > 4.5 ? "#fff" : "#111",
  };
};

export const getSecondary = (mode: string = "light"): PaletteColor => {
  if (mode === "dark") {
    return {
      main: oceanGreenDarkMain,
      light: alpha(oceanGreenDarkBase, 0.5),
      dark: alpha(oceanGreenDarkBase, 0.9),
      contrastText:
        getContrastRatio(oceanGreenDarkBase, "#fff") > 4.5 ? "#fff" : "#111",
    };
  }

  return {
    main: oceanGreenMain,
    light: alpha(oceanGreenBase, 0.5),
    dark: alpha(oceanGreenBase, 0.9),
    contrastText:
      getContrastRatio(oceanGreenBase, "#fff") > 4.5 ? "#fff" : "#111",
  };
};
