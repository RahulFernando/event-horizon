import { Components, paperClasses } from "@mui/material";

export const createComponents = (): Components => {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          [`&.${paperClasses.elevation1}`]: {
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#C6C6C6",
        },
      },
    },
  };
};
