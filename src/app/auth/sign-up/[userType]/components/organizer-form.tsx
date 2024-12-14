"use client";
import { Button, Grid2 as Grid, Stack, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";

import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import {
  OrganizerArgs,
  OrganizerFormInputs,
  OrganizerFormProps,
} from "../user-type.types";

async function saveOrganizer(url: string, { arg }: { arg: OrganizerArgs }) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.errors[0] || "Something went wrong");
  }

  return await response.json();
}

const OrganizerForm: React.FC<OrganizerFormProps> = ({
  isLoading,
  firstName,
}) => {
  const { snackbarToggle } = useContext(SnackbarContext);

  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");

  const {
    formState: { errors },
    control,
    register,
    handleSubmit,
    setValue,
  } = useForm<OrganizerFormInputs>({ defaultValues: { first_name: "" } });

  const {
    isMutating,
    error,
    data,
    trigger: addOrganizer,
  } = useSWRMutation("/api/organizers", saveOrganizer);

  // set first name
  useEffect(() => {
    if (firstName) {
      setValue("first_name", firstName, {
        shouldTouch: true,
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [firstName, setValue]);

  // show success message and redirrect to sign in page
  useEffect(() => {
    if (data) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Details saved successfully",
        severity: "success",
      });
      router.replace("/auth/sign-in");
    }
  }, [data, router, snackbarToggle]);

  // show error message
  useEffect(() => {
    if (error) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  }, [error, snackbarToggle]);

  const submitHandler = (values: OrganizerFormInputs) =>
    addOrganizer({ ...values, user_id: `${userId}` });

  return (
    <form noValidate method="POST" onSubmit={handleSubmit(submitHandler)}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6, xl: 6 }}>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <TextField
                disabled={isLoading}
                fullWidth
                size="small"
                required
                label="Fist Name"
                {...field}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Last Name"
            {...register("last_name")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12, xl: 12 }}>
          <TextField
            fullWidth
            size="small"
            required
            label="National Identity Number"
            {...register("national_identity", {
              required: "National Identity is required",
            })}
            error={!!errors.national_identity}
            helperText={errors.national_identity?.message}
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
          href="/auth/sign-in"
          style={{
            color: "black",
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          I want to login
        </Link>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={isMutating}
        >
          {!isMutating && "Submit"}
          {isMutating && "Please wait..."}
        </Button>
      </Stack>
    </form>
  );
};

export default OrganizerForm;
