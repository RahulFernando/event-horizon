export interface ResetPasswordInput {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
}
