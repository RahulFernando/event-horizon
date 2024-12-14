"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import {
  Box,
  Button,
  Divider,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useFieldArray, useForm } from "react-hook-form";

import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";

import UserType from "./components/role-selection";
import AppTitle from "@/app/components/app-title";
import ContactDetailsInput from "./components/contact-details-input";
import AddressDetailsInput from "./components/address-details-input";

import { SignUpFormInputs, UserType as UserTypes } from "./sign-up.types";
import SnackBar from "@/app/components/snack-bar";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";

async function userSignUp(url: string, { arg }: { arg: SignUpFormInputs }) {
  const { contacts, name, addresses, ...rest } = arg;

  const user = { name, contacts: contacts.map((c) => c.phone), addresses };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ user, ...rest }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.errors[0] || "Something went wrong");
  }

  return await response.json();
}

const SignUpPage = () => {
  const { snackbarToggle } = useContext(SnackbarContext);

  const router = useRouter();

  const [userType, setUserType] = useState<UserTypes>("ORGANIZER");

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SignUpFormInputs>({
    defaultValues: {
      email: "",
      name: "",
      contacts: [{ phone: "" }],
      addresses: [
        { number: "", line_1: "", state: "", country: "", postal_code: "" },
      ],
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: _removeContact,
  } = useFieldArray({
    control,
    name: "contacts",
  });

  const { fields: addressFields } = useFieldArray({
    control,
    name: "addresses",
  });

  const {
    isMutating,
    error,
    data,
    trigger: registerUser,
  } = useSWRMutation("/api/auth/register", userSignUp);

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
    if (data) {
      router.push(`/auth/sign-up/${userType}?userId=${data.account.user_id}`);
    }
  }, [data, router, userType]);

  console.log(data);

  const appendNewContact = () => appendContact({ phone: "" });

  const removeContact = (index: number) => _removeContact(index);

  const userTypeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUserType((event.target as HTMLInputElement).value as UserTypes);

  const submitHandler = (values: SignUpFormInputs) => registerUser(values);

  return (
    <>
      <SnackBar />

      <Box component="div">
        <Box p="0.8rem">
          <AppTitle />

          <Box sx={{ mt: "15%" }}>
            <form
              method="POST"
              autoComplete="off"
              onSubmit={handleSubmit(submitHandler)}
            >
              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
                  <UserType
                    userType={userType}
                    onChange={userTypeChangeHandler}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Name"
                    size="small"
                    required
                    fullWidth
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Email"
                    size="small"
                    fullWidth
                    required
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    label="Password"
                    size="small"
                    required
                    type="password"
                    fullWidth
                    {...register("password", {
                      required: "Password is required",
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }} />
                <Grid size={{ xs: 12 }}>
                  <Stack direction="column" spacing={0.2}>
                    <Typography variant="body2">Contact Details</Typography>
                    <Divider />
                  </Stack>
                </Grid>
                <ContactDetailsInput
                  contactFields={contactFields}
                  control={control}
                  error={errors.contacts && errors.contacts[0]?.phone}
                  errorMessage={
                    errors.contacts && errors.contacts[0]?.phone?.message
                  }
                  onAppend={appendNewContact}
                  onRemove={removeContact}
                />
                <Grid size={{ xs: 12 }} />
                <Grid size={{ xs: 12 }}>
                  <Stack direction="column" spacing={0.2}>
                    <Typography variant="body2">Address Details</Typography>
                    <Divider />
                  </Stack>
                </Grid>
                <AddressDetailsInput
                  addressFields={addressFields}
                  control={control}
                />
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
                  Already have an account?
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  disabled={isMutating}
                >
                  {!isMutating && "Sign Up"}
                  {isMutating && "Please wait..."}
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignUpPage;
