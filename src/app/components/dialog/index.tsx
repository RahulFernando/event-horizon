/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog as MuiDialog,
} from "@mui/material";
import { DialogProps } from "./dialog.types";
import Transition from "./transition";

function isString(content: any): content is string {
  return typeof content === "string";
}

const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  content,
  confirmButtonLabel = "Ok, Delete",
  footerVisible = true,
  maxWidth = "md",
  onClose,
  onConfirm,
}) => (
  <MuiDialog
    maxWidth={maxWidth}
    fullWidth
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={onClose}
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {isString(content) ? (
        <DialogContentText id="alert-dialog-slide-description">
          {content}
        </DialogContentText>
      ) : (
        content
      )}
    </DialogContent>
    {footerVisible && (
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          {confirmButtonLabel}
        </Button>
      </DialogActions>
    )}
  </MuiDialog>
);

export default Dialog;
