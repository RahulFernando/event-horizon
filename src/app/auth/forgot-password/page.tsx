"use client";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Grid2, Stack, TextField } from "@mui/material";
import AppTitle from "@/app/components/app-title";
import SnackBar from "@/app/components/snack-bar";
import { ForgotPasswordFormInputs } from "./forgot-password.types";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";

async function passwordReset(url: string, { arg }: { arg: { email: string } }) {
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

const ForgotPasswordPage = () => {
  const { snackbarToggle } = useContext(SnackbarContext);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<ForgotPasswordFormInputs>();

  const { isMutating, trigger: resetPassword } = useSWRMutation(
    "/api/auth/forgot-password",
    passwordReset,
    {
      onSuccess: () => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Check your email",
          severity: "success",
        });
      },
      onError: (error) => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: error.message,
          severity: "error",
        });
      },
    }
  );

  const submitHandler = (values: ForgotPasswordFormInputs) =>
    resetPassword({ email: values.email });

  return (
    <>
      <SnackBar />
      <Box component="div">
        <Box p="0.8rem">
          <AppTitle sx={{ color: "primary.dark", textDecoration: "none" }} />

          <Box sx={{ mt: "20%" }}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    label="Email"
                    fullWidth
                    size="small"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid2>
              </Grid2>

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  LinkComponent={Link}
                  href="/auth/sign-in"
                >
                  Sign In
                </Button>
                <Button type="submit" variant="contained" size="small">
                  {!isMutating && "Submit"}
                  {isMutating && "Please wait"}
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;
