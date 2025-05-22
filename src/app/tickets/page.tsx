"use client";
import React, { useContext, useEffect } from "react";
import SnackBar from "../components/snack-bar";
import AppBar from "../components/app-bar";
import { Box, Button, Container, Stack } from "@mui/material";
import TicketCard from "./components/ticket-card";
import { Ticket } from "@prisma/client";
import useSWR from "swr";
import { AuthContext } from "../contexts/auth/auth-context";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "../contexts/snackbar/snackbar-context";
import { ActionKind } from "../contexts/snackbar/snackbar.types";

async function fetchTickets(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { count: number; items: Ticket[] };
}

async function deleteTicket(
  url: string,
  token: string,
  { args }: { args: { id: string } }
) {
  const response = await fetch(`${url}/${args.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

const TicketsPage = () => {
  const { token, account } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const { data: ticketResult = { count: 0, items: [] }, mutate: refetch } =
    useSWR(account && `/api/tickets?userId=${account.user.id}`, fetchTickets);

  const { isMutating: isDeleting, trigger: ticketDelete } = useSWRMutation(
    "/api/tickets",
    (url: string, { arg }: { arg: { id: string } }) =>
      deleteTicket(url, token as string, { args: arg }),
    {
      onSuccess: () => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Ticket deleted successfully",
          severity: "success",
        });
        refetch();
      },
      onError: (err) => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: err.message,
          severity: "error",
        });
      },
    }
  );

  const { items: tickets = [] } = ticketResult;

  useEffect(() => {
    if (isDeleting) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isDeleting, snackbarToggle]);

  const deleteClickHandler = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    ticketDelete({ id });
  };

  return (
    <>
      <SnackBar />
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            LinkComponent={Link}
            href="/tickets/create"
            size="small"
            variant="contained"
          >
            New Ticket
          </Button>
        </Box>
        <Stack
          direction="column"
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {tickets.map(({ id, title, created_at, status }) => (
            <TicketCard
              key={id}
              id={id}
              title={title}
              status={status}
              createdAt={created_at}
              onDeleteClick={deleteClickHandler}
            />
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default TicketsPage;
