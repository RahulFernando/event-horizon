"use client";
import { useContext } from "react";
import { AuthContext } from "../context/auth/auth-context";
import useSWR from "swr";
import { Event, Organizer } from "@prisma/client";
import { Button, Container, Grid2, Stack } from "@mui/material";
import AppBar from "../components/app-bar";
import EventItem from "./components/event-item";

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

  return (await response.json()) as Event[];
}

export default function MyEventsPage() {
  const { account } = useContext(AuthContext);

  const { data: organizer } = useSWR(
    `/api/users/${account?.user.id}/organizers`,
    fetchOrganizer
  );

  const { data: events = [] } = useSWR(
    `/api/organizers/${organizer?.id}/events`,
    fetchEvents
  );

  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button variant="contained">New Event</Button>
        </Stack>
        <Grid2 container spacing={2} mt={4}>
          {events.map((event) => (
            <Grid2 key={event.id} size={{ xs: 12 }}>
              <EventItem
                title={event.title}
                venue={event.venue}
                date_time={event.date_time}
              />
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </>
  );
}
