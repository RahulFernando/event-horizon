import { ThemeOptions } from "@mui/material/styles";
import { createComponents } from "./create-component";
import { createPalette } from "./create-palette";

export const createOptions = (): ThemeOptions => {
  const palette = createPalette();
  const components = createComponents();

  return {
    components,
    palette,
  };
};
