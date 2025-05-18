"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth/auth-context";
import useSWR from "swr";
import { Event, Organizer } from "@prisma/client";
import {
  Button,
  Container,
  Grid2,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import AppBar from "../components/app-bar";
import EventItem from "./components/event-item";
import FilterToolbar from "./components/filter-toolbar";
import EventItemSkeleton from "./components/event-item-skeleton";
import useSWRMutation from "swr/mutation";
import Link from "next/link";
import SnackBar from "../components/snack-bar";
import { SnackbarContext } from "../contexts/snackbar/snackbar-context";
import { ActionKind } from "../contexts/snackbar/snackbar.types";
import { useRouter } from "next/navigation";
import AuthGuard from "../guards/auth-guard";

async function fetchOrganizer(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as Organizer;
}

async function fetchEvents(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { count: number; items: Event[] };
}

async function deleteEvent(url: string, { arg }: { arg: { id: string } }) {
  const response = await fetch(`${url}/${arg.id}`, { method: "DELETE" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

export default function MyEventsPage() {
  const { account } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const router = useRouter();

  const [filters, setFilters] = useState({
    searchTerm: "",
    dateTime: "asc",
  });

  const searchParams = new URLSearchParams({
    title: filters.searchTerm,
    dateTime: filters.dateTime,
  });

  const { data: organizer } = useSWR(
    `/api/users/${account?.user.id}/organizers`,
    fetchOrganizer
  );

  const {
    data: events = { count: 0, items: [] },
    isLoading,
    mutate,
  } = useSWR(
    `/api/organizers/${organizer?.id}/events?${searchParams}`,
    fetchEvents
  );

  const { isMutating, error, data, trigger } = useSWRMutation(
    `/api/organizers/${organizer?.id}/events`,
    deleteEvent
  );

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
    if (isMutating) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isMutating, snackbarToggle]);

  useEffect(() => {
    if (data) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Event deleted successfully",
        severity: "success",
      });
    }
  }, [data, snackbarToggle]);

  const searchTermChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setFilters((filters) => ({
      ...filters,
      [event.target.name]: event.target.value,
    }));

  const dateTimeChangeHandler = (event: SelectChangeEvent) =>
    setFilters((filters) => ({
      ...filters,
      [event.target.name]: event.target.value,
    }));

  const deleteClickHandler = (id: string) => {
    trigger({ id });
    mutate();
  };

  const eventClickHandler = (id: string) => router.push(`/my-events/${id}`);

  return (
    <AuthGuard userType="ORGANIZER">
      <SnackBar />
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
          <FilterToolbar
            {...filters}
            onSearchTermChange={searchTermChangeHandler}
            onDateTimeChange={dateTimeChangeHandler}
          />
          <Button
            variant="contained"
            LinkComponent={Link}
            href="/my-events/create"
          >
            New Event
          </Button>
        </Stack>
        <Grid2 container spacing={2} mt={4}>
          {isLoading &&
            isMutating &&
            events.items.map((event) => (
              <Grid2 key={event.id} size={{ xs: 12 }}>
                <EventItemSkeleton />
              </Grid2>
            ))}
          {!isLoading &&
            !isMutating &&
            events.items.map((event) => (
              <Grid2 key={event.id} size={{ xs: 12 }}>
                <EventItem
                  id={event.id}
                  title={event.title}
                  venue={event.venue}
                  date_time={event.date_time}
                  enabled={event.enabled ?? true}
                  onDelete={deleteClickHandler}
                  onClick={eventClickHandler}
                />
              </Grid2>
            ))}
        </Grid2>
      </Container>
    </AuthGuard>
  );
}
