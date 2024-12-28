/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, PropsWithChildren, useEffect, useReducer } from "react";
import {
  AuthAccount,
  AuthAction,
  AuthState,
  IAuthContext,
} from "./auth-context-types";
import useLocalStorage from "@/app/hooks/use-local-storage";
import checkTokenValidity from "@/lib/utils/check-token-validity";

export const AuthContext = createContext<IAuthContext>({
  loginSuccess: (val) => {},
  signOut: () => {},
});

const initialState: AuthState = {
  token: "",
  account: undefined,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload,
      };

    case "SIGN_OUT":
      return {
        token: "",
        account: undefined,
      };

    default:
      return { ...state };
  }
};

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const [token, setToken, removeToken] = useLocalStorage("access-token");
  const [account, setAccount, removeAccont] = useLocalStorage("account");

  // if token exist and valid dispatch action to login otherwise sign out
  useEffect(() => {
    if (token) {
      const isValid = checkTokenValidity(token);
      if (isValid) {
        dispatch({ type: "LOGIN", payload: { token, account } });
        return;
      }
      removeToken();
      removeAccont();
      dispatch({ type: "SIGN_OUT" });
    }
  }, [account, removeAccont, removeToken, token]);

  const loginSuccessHandler = ({
    token,
    account,
  }: {
    token: string;
    account: AuthAccount;
  }) => {
    setToken(token);
    setAccount(account);
    dispatch({ type: "LOGIN", payload: { token, account } });
  };

  const signOutHandler = () => {
    removeToken();
    removeAccont();
    dispatch({ type: "SIGN_OUT" });
  };

  const values = {
    ...authState,
    loginSuccess: loginSuccessHandler,
    signOut: signOutHandler,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
