import {
  Theme,
  createTheme as createMuiTheme,
  // responsiveFontSizes,
} from "@mui/material/styles";

import { createOptions as createBaseOptions } from "./base/create-options";
import { createOptions as createLightOptions } from "./light/create-options";

export const createTheme = (): Theme => {
  const theme: Theme = createMuiTheme(
    createBaseOptions(),
    createLightOptions()
  );

  return theme;
};
