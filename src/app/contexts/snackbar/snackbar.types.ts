import { AlertColor, AlertPropsColorOverrides } from "@mui/material";
import { OverridableStringUnion } from "@mui/types";

export enum ActionKind {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
}

export interface IState {
  open: boolean;
  message?: string;
  severity?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
}

export interface IAction {
  type: ActionKind;
  payload?: IState;
}

export interface ISnackbarContext extends IState {
  snackbarToggle: (type: ActionKind, payload?: IState) => void;
}
