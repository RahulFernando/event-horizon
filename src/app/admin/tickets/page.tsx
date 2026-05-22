"use client";
import React, { useContext } from "react";
import AdminLayout from "@/app/components/admin-layout";
import SnackBar from "@/app/components/snack-bar";
import StatisticsCard from "@/app/admin/components/statistics-card";
import { Box, Button, Grid2, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { ITicket } from "@/app/types";
import { TicketStatus } from "@prisma/client";
import useSWR from "swr";
import useDialog from "@/app/hooks/use-dialog";
import TicketDetailDialog from "./components/ticket-detail-dialog";
import useSWRMutation from "swr/mutation";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { stringify } from "querystring";

const COLUMNS: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2,
  },
];

async function fetchTickets(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { items: ITicket[]; count: number };
}

async function fetchCommentsCount(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { count: number };
}

async function changeTicketStatus(
  url: string,
  token: string,
  { arg }: { arg: { id: string; status: TicketStatus } },
) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: arg.status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

const TicketsPage = () => {
  const { token } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const [tabIndex, setTabIndex] = React.useState(0);
  const { open, info, clickOpenHandler, clickCloseHandler } = useDialog();

  const {
    data: openTickets = { items: [], count: 0 },
    mutate: mutateOpenTickets,
  } = useSWR(`/api/tickets?status=${TicketStatus.OPEN}`, fetchTickets);

  const {
    data: closedTickets = { items: [], count: 0 },
    mutate: mutateCloseTickets,
  } = useSWR(`/api/tickets?status=${TicketStatus.CLOSED}`, fetchTickets);

  const { data: commentsCount = { count: 0 } } = useSWR(
    "/api/tickets/comments",
    fetchCommentsCount,
  );

  const { trigger: updateStatus } = useSWRMutation(
    "/api/tickets",
    (url: string, { arg }: { arg: { id: string; status: TicketStatus } }) =>
      changeTicketStatus(url, token as string, { arg }),
    {
      onSuccess: () => {
        mutateOpenTickets();
        mutateCloseTickets();
      },
      onError(err) {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: stringify(err),
          severity: "error",
        });
      },
    },
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (params: { row: ITicket }) => {
    clickOpenHandler({ data: params.row });
  };

  const changeStatus = (id: string, status: TicketStatus) =>
    updateStatus({
      id,
      status:
        status === TicketStatus.OPEN ? TicketStatus.CLOSED : TicketStatus.OPEN,
    });

  const columns: GridColDef[] = [
    ...COLUMNS,
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          disableElevation
          color={params.row.status === TicketStatus.OPEN ? "error" : "success"}
          onClick={(e) => {
            e.stopPropagation();
            changeStatus(params.row.id, params.row.status);
          }}
        >
          {params.row.status === TicketStatus.OPEN ? "Close" : "Open"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <SnackBar />
      <AdminLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4">Tickets</Typography>
        </Box>
        <Grid2 container spacing={2} sx={{ mb: 3 }}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <StatisticsCard
              title="Open Tickets"
              value={openTickets.count}
              icon="/icons/ticket-status/pending.png"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <StatisticsCard
              title="Closed Tickets"
              value={closedTickets.count}
              icon="/icons/ticket-status/ok.png"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <StatisticsCard
              title="Total Comments"
              value={commentsCount.count}
              icon="/icons/ticket-status/question-mark.png"
            />
          </Grid2>
        </Grid2>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Open Tickets" sx={{ textTransform: "none" }} />
          <Tab label="Closed Tickets" sx={{ textTransform: "none" }} />
        </Tabs>
        <Box sx={{ height: 500, width: "100%", mt: 2 }}>
          {tabIndex === 0 && (
            <DataGrid
              rows={openTickets.items}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              onRowClick={handleRowClick}
              sx={{ cursor: "pointer" }}
            />
          )}
          {tabIndex === 1 && (
            <DataGrid
              rows={closedTickets.items}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              onRowClick={handleRowClick}
              sx={{ cursor: "pointer" }}
            />
          )}
        </Box>
      </AdminLayout>
      <TicketDetailDialog
        open={open}
        ticket={info?.data ?? null}
        onClose={clickCloseHandler}
      />
    </>
  );
};

export default TicketsPage;
