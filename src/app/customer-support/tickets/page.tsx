"use client";
import React, { useContext, useEffect, useState } from "react";
import CustomerSupportLayout from "@/app/components/customer-support-layout";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { getTicketStatusChip } from "./utils/get-ticket-status-chip";
import { Box, Button, SelectChangeEvent } from "@mui/material";
import useSWR from "swr";
import { ITicket } from "@/app/types";
import useDialog from "@/app/hooks/use-dialog";
import Dialog from "@/app/components/dialog";
import TicketDetails from "./components/ticket-details";
import { TicketCommentFormInput } from "@/app/tickets/tickets.types";
import useSWRMutation from "swr/mutation";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { TicketComment, TicketStatus } from "@prisma/client";
import { DIALOG_INFO_TYPE } from "@/app/constants";
import TicketStatusChangeForm from "./components/ticket-status-change-form";
import SnackBar from "@/app/components/snack-bar";

const defaultColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params: GridRenderCellParams<ITicket>) =>
      getTicketStatusChip(params.row.status),
  },
  {
    field: "createdBy",
    headerName: "Created By",
    flex: 1,
    valueGetter: (params, row: ITicket) => row.user.name,
    renderCell: (params: GridRenderCellParams<ITicket>) => params.row.user.name,
  },
];

async function fetchTickets(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { count: number; items: ITicket[] };
}

async function fetchComments(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { count: number; items: TicketComment[] };
}

async function createComment(
  url: string,
  token: string,
  { args }: { args: TicketCommentFormInput }
) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

async function updateTicketStatus(
  url: string,
  token: string,
  { args }: { args: { id: string; status: TicketStatus } }
) {
  const { id, status } = args;
  const response = await fetch(`${url}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({ status }),
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

  const [comment, setComment] = useState("");

  const { open, info, setInfo, clickCloseHandler, clickOpenHandler } =
    useDialog();

  const {
    data: ticketResult = { count: 0, items: [] },
    mutate: refetchTickets,
  } = useSWR("/api/tickets", fetchTickets);

  const { data: commentResult = { count: 0, items: [] }, mutate: refetch } =
    useSWR(info && `/api/tickets/${info.data.id}/comments`, fetchComments);

  const { items: comments = [] } = commentResult;

  const { trigger: createNewComment, isMutating: isCreatingComment } =
    useSWRMutation(
      info && `/api/tickets/${info.data.id}/comments`,
      (url: string, { arg }: { arg: TicketCommentFormInput }) =>
        createComment(url, token as string, { args: arg }),
      {
        onSuccess: () => {
          snackbarToggle(ActionKind.OPEN, {
            open: true,
            message: "Comment saved successfully",
            severity: "success",
          });
          setComment("");
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

  const { trigger: changeStatus, isMutating: isStatusChanging } =
    useSWRMutation(
      "/api/tickets",
      (url: string, { arg }: { arg: { id: string; status: TicketStatus } }) =>
        updateTicketStatus(url, token as string, { args: arg }),
      {
        onSuccess: () => {
          clickCloseHandler();
          snackbarToggle(ActionKind.OPEN, {
            open: true,
            message: "Status changed successfully",
            severity: "success",
          });
          refetchTickets();
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
    if (isStatusChanging) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isStatusChanging, snackbarToggle]);

  const rowClickHandler = (params: GridRowParams<ITicket>) => {
    clickOpenHandler({
      type: DIALOG_INFO_TYPE.TICKET_DETAILS,
      data: params.row,
    });
  };

  const commentHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setComment(event.target.value);

  const submitHandler = () => createNewComment({ body: comment });

  const changeTicketStatus = () =>
    info && changeStatus({ id: info?.data.id, status: info?.data.status });

  const statusChangeClickHandler = (
    ticket: ITicket,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    clickOpenHandler({
      type: DIALOG_INFO_TYPE.TICKET_STATUS_CHANGE,
      data: ticket,
    });
  };

  const statusChangeHandler = (event: SelectChangeEvent) =>
    setInfo((prev) => ({
      ...prev,
      data: { ...prev?.data, status: event.target.value as TicketStatus },
    }));

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: (params: GridRenderCellParams<ITicket>) => (
        <Button
          size="small"
          variant="contained"
          onClick={statusChangeClickHandler.bind(this, params.row)}
        >
          Change Status
        </Button>
      ),
    },
  ];

  return (
    <>
      <SnackBar />
      <CustomerSupportLayout>
        <Box sx={{ height: 500, width: "100%", mt: 2 }}>
          <DataGrid
            columns={columns}
            rows={tickets}
            slots={{ toolbar: GridToolbar }}
            onRowClick={rowClickHandler}
          />
        </Box>
      </CustomerSupportLayout>

      {info?.type === DIALOG_INFO_TYPE.TICKET_DETAILS && (
        <Dialog
          title="Ticket Details"
          maxWidth="lg"
          content={
            info && (
              <TicketDetails
                {...info.data}
                comment={comment}
                comments={comments}
                onCommentChange={commentHandler}
              />
            )
          }
          open={open}
          confirmButtonLabel={isCreatingComment ? "Please wait.." : "Submit"}
          disableSubmitButton={isCreatingComment || !comment}
          onClose={clickCloseHandler}
          onConfirm={submitHandler}
        />
      )}
      {info?.type === DIALOG_INFO_TYPE.TICKET_STATUS_CHANGE && (
        <Dialog
          title="Ticket Status"
          content={
            info && (
              <TicketStatusChangeForm
                currentStatus={info.data.status as TicketStatus}
                onChange={statusChangeHandler}
              />
            )
          }
          open={open}
          confirmButtonLabel={isStatusChanging ? "Please wait.." : "Submit"}
          disableSubmitButton={isStatusChanging}
          onClose={clickCloseHandler}
          onConfirm={changeTicketStatus}
        />
      )}
    </>
  );
};

export default TicketsPage;
