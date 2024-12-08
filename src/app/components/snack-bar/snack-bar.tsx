import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { Alert, Snackbar } from "@mui/material";
import React, { useContext } from "react";

const SnackBar = () => {
  const { open, message, severity, snackbarToggle } =
    useContext(SnackbarContext);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      onClose={() => snackbarToggle(ActionKind.CLOSE)}
    >
      <Alert severity={severity} sx={{ width: "100%" }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
