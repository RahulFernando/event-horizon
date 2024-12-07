"use client";
import React from "react";

import { Box, Button, Stack, TextField } from "@mui/material";
import useSWRMutation from "swr/mutation";
import Grid from "@mui/material/Grid2";
import Link from "next/link";
import AppTitle from "@/app/components/app-title";
import { useForm } from "react-hook-form";
import { SignInFormInputs } from "./sign-in.types";

async function userSignIn(url: string, { arg }: { arg: SignInFormInputs }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((response) => response.json());
}

export default function SignInPage() {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SignInFormInputs>();

  const { isMutating, trigger: signInUser } = useSWRMutation(
    "/api/auth/login",
    userSignIn
  );

  const submitHandler = async (data: SignInFormInputs) =>
    await signInUser(data);

  return (
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
  );
}
