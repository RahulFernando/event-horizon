import { Account, User } from "@prisma/client";

export interface AuthUser extends User {
  organizers?: { id: string };
  vendors?: { id: string };
}

export interface AuthAccount extends Account {
  user: AuthUser;
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
