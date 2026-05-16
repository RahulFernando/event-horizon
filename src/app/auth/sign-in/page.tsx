"use client";
import React, { useContext, useEffect } from "react";

import Link from "next/link";
import { Box, Button, Stack, TextField, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AppTitle from "@/app/components/app-title";
import SnackBar from "@/app/components/snack-bar";

import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { AuthContext } from "@/app/contexts/auth/auth-context";

import useSWRMutation from "swr/mutation";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { SignInFormInputs } from "./sign-in.types";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { UserType } from "@prisma/client";

async function userSignIn(url: string, { arg }: { arg: SignInFormInputs }) {
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

export default function SignInPage() {
  const theme = useTheme();

  const { snackbarToggle } = useContext(SnackbarContext);
  const { loginSuccess } = useContext(AuthContext);

  const router = useRouter();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SignInFormInputs>();

  const {
    isMutating,
    error,
    data: authDetails,
    trigger: signInUser,
  } = useSWRMutation("/api/auth/login", userSignIn);

  useEffect(() => {
    if (error) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  }, [error, snackbarToggle]);

  useEffect(() => {
    if (authDetails) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Logged in successfully",
        severity: "success",
      });
      loginSuccess(authDetails);
      const { account } = authDetails;

      if (account.user.user_type === UserType.ADMIN) {
        router.replace("/admin");
        return;
      }

      if (account.user.user_type === UserType.CUSTOMER_SUPPORT_REPRESENTATIVE) {
        router.replace("/customer-support/tickets");
        return;
      }

      router.replace("/");
    }
  }, [authDetails, loginSuccess, router, snackbarToggle]);

  const submitHandler = async (data: SignInFormInputs) =>
    await signInUser(data);

  return (
    <>
      <SnackBar />

      <Box component="div">
        <Box p="0.8rem">
          <AppTitle sx={{ color: "primary.dark", textDecoration: "none" }} />

          <Box sx={{ mt: "20%" }}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
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
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    size="small"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        message: "Password must be at least 8 characters",
                        value: 8,
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Grid>
              </Grid>

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Link
                  href="/auth/forgot-password"
                  style={{
                    color: theme.palette.primary.dark,
                    fontSize: "12px",
                    textDecoration: "none",
                  }}
                >
                  Forgot Password?
                </Link>
                <Box component="div" sx={{ display: "flex", gap: "0.5rem" }}>
                  <Button
                    LinkComponent={Link}
                    href="/auth/sign-up"
                    variant="outlined"
                    size="small"
                  >
                    Register
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={isMutating}
                  >
                    {!isMutating && "Sign In"}
                    {isMutating && "Sign In..."}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
}
