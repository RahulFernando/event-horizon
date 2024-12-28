import { Account, User } from "@prisma/client";

export interface AuthAccount extends Account {
  user: User;
}

export interface IAuthContext {
  token?: string;
  account?: AuthAccount;
  loginSuccess: ({
    token,
    account,
  }: {
    token: string;
    account: AuthAccount;
  }) => void;
  signOut: () => void;
}

export type AuthState = Omit<IAuthContext, "loginSuccess" | "signOut">;

export type ActionType = "LOGIN" | "SIGN_OUT";

export type AuthAction = { type: ActionType; payload?: AuthState };
