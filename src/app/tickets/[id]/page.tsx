"use client";
import AppBar from "@/app/components/app-bar";
import SnackBar from "@/app/components/snack-bar";
import { Container } from "@mui/material";
import React from "react";
import TicketForm from "../components/ticket-form";
import { useParams } from "next/navigation";
import { Ticket } from "@prisma/client";
import useSWR from "swr";

async function fetchTicket(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as Ticket;
}

const TicketDetailPage = () => {
  const params = useParams();

  const { data: ticket } = useSWR(`/api/tickets/${params.id}`, fetchTicket);

  return (
    <>
      <SnackBar />
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <TicketForm ticket={ticket} />
      </Container>
    </>
  );
};

export default TicketDetailPage;
