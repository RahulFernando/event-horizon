import React from "react";
import AppBar from "../components/app-bar";
import { Button, Container, Stack } from "@mui/material";
import Link from "next/link";

const MyGigsPage = () => {
  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <FilterToolbar
            {...filters}
            onSearchTermChange={searchTermChangeHandler}
            onDateTimeChange={dateTimeChangeHandler}
          /> */}
          <Button
            variant="contained"
            LinkComponent={Link}
            href="/my-gigs/create"
          >
            New Gig
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default MyGigsPage;
