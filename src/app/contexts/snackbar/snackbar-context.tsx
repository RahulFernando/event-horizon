import {
  createContext,
  PropsWithChildren,
  useCallback,
  useReducer,
} from "react";
import {
  ISnackbarContext,
  IState,
  IAction,
  ActionKind,
} from "./snackbar.types";

export const SnackbarContext = createContext<ISnackbarContext>({
  open: false,
  message: undefined,
  snackbarToggle: () => {
    return;
  },
});

const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case ActionKind.OPEN:
      return {
        ...state,
        ...action.payload,
        open: true,
      };

    case ActionKind.CLOSE:
      return {
        ...state,
        ...action.payload,
        open: false,
      };

    default:
      return state;
  }
};

const initialValues: IState = {
  open: false,
  message: undefined,
};

const SnackbarProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  const snackbarToggle = useCallback((type: ActionKind, payload?: IState) => {
    dispatch({
      type: type,
      payload,
    });
  }, []);

  const values = { ...state, snackbarToggle };

  return (
    <SnackbarContext.Provider value={values}>
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
