"use client";
import React from "react";
import AccountInfo from "@/app/profile/components/account-info";
import Header from "@/app/profile/components/header";
import PersonaInfo from "@/app/profile/components/persona-info";
import { Grid2, Stack } from "@mui/material";
import AdminLayout from "@/app/components/admin-layout";
import SnackBar from "@/app/components/snack-bar";

const ProfilePage = () => {
  return (
    <>
      <SnackBar />
      <AdminLayout>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Stack
              direction="column"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Header />
              <PersonaInfo />
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <AccountInfo />
          </Grid2>
        </Grid2>
      </AdminLayout>
    </>
  );
};

export default ProfilePage;
