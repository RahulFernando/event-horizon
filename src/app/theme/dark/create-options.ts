import { createComponents } from "./create-component";
import { createPalette } from "./create-palette";

export const createOptions = () => {
  const palette = createPalette();
  const components = createComponents();

  return {
    components,
    palette,
  };
};
