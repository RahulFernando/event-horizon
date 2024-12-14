"use client";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { Button, Grid2 as Grid, Stack, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";

import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { VendorArgs, VendorFormInputs } from "../user-type.types";

async function saveVendor(url: string, { arg }: { arg: VendorArgs }) {
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

const VendorForm = () => {
  const { snackbarToggle } = useContext(SnackbarContext);

  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<VendorFormInputs>();

  const {
    isMutating,
    error,
    data,
    trigger: addOrganizer,
  } = useSWRMutation("/api/vendors", saveVendor);

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

  const submitHandler = (values: VendorFormInputs) =>
    addOrganizer({ ...values, user_id: `${userId}` });

  return (
    <form noValidate method="POST" onSubmit={handleSubmit(submitHandler)}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6, xl: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Business Registration"
            required
            {...register("business_registration", {
              required: "Business Registration is required",
            })}
            error={!!errors.business_registration}
            helperText={errors.business_registration?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Taxpayer Identification Number"
            {...register("taxpayer_identification_number", {
              required: "Taxpayer Identification Number is required",
            })}
            error={!!errors.taxpayer_identification_number}
            helperText={errors.taxpayer_identification_number?.message}
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

export default VendorForm;
