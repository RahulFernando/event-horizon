"use client";
import React from "react";
import AppBar from "../components/app-bar";
import { Container, Grid2, Stack } from "@mui/material";
import Header from "./components/header";
import PersonaInfo from "./components/persona-info";
import AccountInfo from "./components/account-info";
import SnackBar from "../components/snack-bar";

const ProfilePage = () => {
  return (
    <>
      <SnackBar />
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
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
      </Container>
    </>
  );
};

export default ProfilePage;
