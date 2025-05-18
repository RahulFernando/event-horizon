"use client";
import React, { useContext } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { Typography, Box, Chip } from "@mui/material";
import AdminLayout from "@/app/components/admin-layout";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import useDialog from "@/app/hooks/use-dialog";
import Dialog from "@/app/components/dialog";
import SnackBar from "@/app/components/snack-bar";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { IGig } from "@/app/types";
import GigDetail from "./components/gig-detail";

async function fetchGigs(url: string, token: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Failed to update vendor");
  }

  return (await response.json()) as { count: number; items: IGig[] };
}

async function updateStatus(
  url: string,
  token: string,
  { args }: { args: { enabled: boolean } }
) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

const defaultColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 1,
  },
  {
    field: "category",
    headerName: "Venue",
    flex: 1,
    renderCell: (params: GridRenderCellParams<IGig>) =>
      params.row.category.name,
  },
  {
    field: "enabled",
    headerName: "Enabled",
    flex: 1,
    renderCell: (params: GridRenderCellParams<IGig>) => (
      <Chip
        size="small"
        label={params.row.enabled ? "Enabled" : "Disabled"}
        color={params.row.enabled ? "success" : "error"}
      />
    ),
  },
];

const AdminGigsPage = () => {
  const { token } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const { open, info, clickCloseHandler, clickOpenHandler } = useDialog();

  const { data: gigs = { count: 0, items: [] }, mutate } = useSWR(
    "/api/gigs",
    (url: string) => fetchGigs(url, token as string)
  );

  const { isMutating, trigger: changeStatus } = useSWRMutation(
    info?.data && `/api/gigs/${info.data.id}`,
    (url: string, { arg }: { arg: { enabled: boolean } }) =>
      updateStatus(url, token as string, { args: arg }),
    {
      onSuccess: () => {
        mutate();
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Status changed successfully",
          severity: "success",
        });
        clickCloseHandler();
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

  const buttonLabel = info && info.data.enabled ? "Disable" : "Enable";

  const rowClickHandler = (param: GridRowParams<IGig>) =>
    clickOpenHandler({ data: param.row });

  const disableHandler = () => changeStatus({ enabled: !info?.data.enabled });

  return (
    <>
      <SnackBar />
      <AdminLayout>
        <Typography variant="h4">Gigs</Typography>
        <Box sx={{ height: 500, width: "100%", mt: 2 }}>
          <DataGrid
            rows={gigs.items}
            columns={defaultColumns}
            onRowClick={rowClickHandler}
          />
        </Box>
      </AdminLayout>
      <Dialog
        open={open}
        title={`${info?.data?.title}`}
        content={<GigDetail id={info?.data.id} />}
        confirmButtonLabel={buttonLabel}
        disableSubmitButton={isMutating}
        onConfirm={disableHandler}
        onClose={clickCloseHandler}
      />
    </>
  );
};

export default AdminGigsPage;
