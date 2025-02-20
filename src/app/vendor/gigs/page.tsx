"use client";
import React, { useContext, useEffect, useState } from "react";
import AppBar from "../../components/app-bar";
import { Box, Button, Container, Grid2, Stack } from "@mui/material";
import Link from "next/link";
import { IVendorGigs } from "../../types";
import useSWR from "swr";
import useMutation from "swr/mutation";
import GigPreview from "./components/gig-preview";
import { useRouter } from "next/navigation";
import GigItemSkeleton from "./components/gig-item-skeleton";
import useDialog from "../../hooks/use-dialog";
import Dialog from "../../components/dialog";
import { SnackbarContext } from "../../contexts/snackbar/snackbar-context";
import { ActionKind } from "../../contexts/snackbar/snackbar.types";
import Navigation from "../dashboard/components/navigation";
import { AuthContext } from "@/app/contexts/auth/auth-context";

async function fetchGigs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IVendorGigs;
}

async function deleteGig(url: string, { arg }: { arg: { id: string } }) {
  const response = await fetch(`${url}/${arg.id}`, { method: "DELETE" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IVendorGigs;
}

const MyGigsPage = () => {
  const router = useRouter();

  const { snackbarToggle } = useContext(SnackbarContext);
  const { account } = useContext(AuthContext);

  const [selectedGig, setSelectedGig] = useState<
    | {
        id: string;
        title: string;
      }
    | undefined
  >();

  const { vendors } = account?.user ?? { vendors: { id: "" } };

  const {
    isLoading,
    data: gigs = { count: 0, items: [] },
    mutate,
  } = useSWR(`/api/vendors/${vendors?.id}/gigs`, fetchGigs);

  const {
    isMutating,
    error,
    data,
    trigger: deleteMyGig,
  } = useMutation("/api/gigs", deleteGig);

  useEffect(() => {
    if (isMutating) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isMutating, snackbarToggle]);

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
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Gig deleted successfully",
        severity: "success",
      });
      setSelectedGig(undefined);
      mutate();
    }
  }, [data, mutate, snackbarToggle]);

  const { open, clickCloseHandler, clickOpenHandler } = useDialog();

  const clickHandler = (id: string) =>
    router.push(`/vendor/gigs/${id}?activeTab=basic`);

  const deleteClickHandler = (
    params: { id: string; title: string },
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    clickOpenHandler({});
    setSelectedGig({ ...params });
  };

  const confirmHandler = () => {
    clickCloseHandler();
    deleteMyGig({ id: selectedGig?.id ?? "" });
  };

  const myGigs = gigs.items.map(
    ({ id, title, description, location, event_types }) => ({
      id,
      title,
      description: description ?? "",
      location,
      event_types: event_types.map((type) => type.event_type.name),
    })
  );

  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Stack
          direction="row"
          spacing={4}
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Navigation />
          <Box sx={{ flexGrow: 1 }}>
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
                href="/vendor/gigs/create"
              >
                New Gig
              </Button>
            </Stack>
            <Grid2 container spacing={2} mt={4}>
              {isLoading &&
                [3, 4, 5, 6].map((gig) => <GigItemSkeleton key={gig} />)}
              {!isLoading &&
                myGigs.map((gig) => (
                  <Grid2 key={gig.id} size={{ xs: 12, md: 4, lg: 3 }}>
                    <GigPreview
                      {...gig}
                      onClick={clickHandler}
                      onDeleteClick={deleteClickHandler}
                    />
                  </Grid2>
                ))}
            </Grid2>
          </Box>
        </Stack>
      </Container>

      <Dialog
        open={open}
        title="Delete Confirmation"
        content={`Are sure you want to delete ${selectedGig?.title}. This is a permanent action that cannot be reversed.`}
        onClose={clickCloseHandler}
        onConfirm={confirmHandler}
      />
    </>
  );
};

export default MyGigsPage;
