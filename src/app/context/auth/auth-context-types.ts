import { Account } from "@prisma/client";

export interface IAuthContext {
  token?: string;
  account?: Account;
  loginSuccess: ({
    token,
    account,
  }: {
    token: string;
    account: Account;
  }) => void;
  signOut: () => void;
}

export type AuthState = Omit<IAuthContext, "loginSuccess" | "signOut">;

export type ActionType = "LOGIN" | "SIGN_OUT";

export type AuthAction = { type: ActionType; payload?: AuthState };
