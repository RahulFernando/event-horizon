"use client";
import React, { useContext, useEffect } from "react";

import Link from "next/link";
import { Box, Button, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AppTitle from "@/app/components/app-title";
import SnackBar from "@/app/components/snack-bar";

import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";

import useSWRMutation from "swr/mutation";
import { useForm } from "react-hook-form";

import { SignInFormInputs } from "./sign-in.types";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";

async function userSignIn(url: string, { arg }: { arg: SignInFormInputs }) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

export default function SignInPage() {
  const { snackbarToggle } = useContext(SnackbarContext);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SignInFormInputs>();

  const {
    isMutating,
    error,
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

  const submitHandler = async (data: SignInFormInputs) =>
    await signInUser(data);

  return (
    <>
      <SnackBar />

      <Box component="div">
        <Box p="0.8rem">
          <AppTitle />

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
                  href="/auth/reset-password"
                  style={{
                    color: "black",
                    fontSize: "13px",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={isMutating}
                >
                  {!isMutating && "Sign In"}
                  {isMutating && "Sign In..."}
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
}
