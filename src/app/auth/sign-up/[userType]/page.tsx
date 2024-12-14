"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";

import { Box, Typography } from "@mui/material";

import SnackBar from "@/app/components/snack-bar";
import AppTitle from "@/app/components/app-title";
import OrganizerForm from "./components/organizer-form";
import VendorForm from "./components/vendor-form";

import { UserType } from "@/app/enum";
import useSWR from "swr";

async function getUserById(url: string) {
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.errors[0] || "Something went wrong");
  }

  return await response.json();
}

const SignUpWithUserType = () => {
  const searchParams = useSearchParams();
  const params = useParams();

  const userId = searchParams.get("userId");
  const userType = params.userType;

  const { data, isLoading } = useSWR(`/api/users/${userId}`, getUserById);

  return (
    <>
      <SnackBar />

      <Box component="div">
        <Box p="0.8rem">
          <AppTitle />

          <Box sx={{ mt: "15%" }}>
            <Typography variant="subtitle1">
              <span style={{ color: "#44AB96" }}>Hey! </span>
              We need some extra details from you.
            </Typography>
            <Box component="div" mt="1rem" />
            {userType === UserType.ORGANIZER && (
              <OrganizerForm isLoading={isLoading} firstName={data?.name} />
            )}
            {userType === UserType.VENDOR && <VendorForm />}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignUpWithUserType;
