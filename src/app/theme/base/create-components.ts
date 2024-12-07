import { Components } from "@mui/material";

export const createComponents = (): Components => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  };
};
