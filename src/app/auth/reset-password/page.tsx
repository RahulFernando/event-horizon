"use client";
import AppTitle from "@/app/components/app-title";
import SnackBar from "@/app/components/snack-bar";
import { Box, Button, Grid2, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  ResetPasswordInput,
  ResetPasswordPayload,
} from "./reset-password.types";
import { useSearchParams } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { useContext } from "react";
import { useRouter } from "next/navigation";

const passwordValidationHelperText =
  "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";

async function resetPassword(
  url: string,
  { arg }: { arg: ResetPasswordPayload },
) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    const message = error?.message ?? error?.errors[0];
    throw new Error(message || "Something went wrong");
  }

  return await response.json();
}

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const { snackbarToggle } = useContext(SnackbarContext);
  const router = useRouter();

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<ResetPasswordInput>();

  const password = watch("password");

  const email = searchParams.get("mail");

  const { isMutating, trigger: resetPsw } = useSWRMutation(
    "/api/auth/reset-password",
    resetPassword,
    {
      onSuccess: () => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Password reset successfully",
          severity: "success",
        });
        router.replace("/auth/sign-in");
      },
      onError: (error) => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: error.message,
          severity: "error",
        });
      },
    },
  );

  const submitHandler = (values: ResetPasswordInput) => {
    const payload = { email: email ?? "", password: values.password };
    resetPsw(payload);
  };

  return (
    <>
      <SnackBar />
      <Box component="div">
        <Box p="0.8rem">
          <AppTitle sx={{ color: "primary.dark", textDecoration: "none" }} />

          <Box sx={{ mt: "15%" }}>
            <form
              method="POST"
              autoComplete="off"
              onSubmit={handleSubmit(submitHandler)}
            >
              <Grid2 container spacing={1.5}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    type="password"
                    label="Password"
                    size="small"
                    required
                    fullWidth
                    error={!!errors.password}
                    helperText={
                      errors.password?.message ?? passwordValidationHelperText
                    }
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    type="password"
                    label="Confirm Password"
                    size="small"
                    required
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                </Grid2>
              </Grid2>

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button type="submit" variant="contained" size="small">
                  {isMutating ? "Resetting..." : "Reset Password"}
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResetPasswordPage;
