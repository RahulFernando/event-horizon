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
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "rgba(0, 0, 0, 0.87)",
          backgroundColor: "#F6F6F3 !important",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E2E1E7",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#999999",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#999999",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#999999",
          },
        },
      },
    },
  };
};
