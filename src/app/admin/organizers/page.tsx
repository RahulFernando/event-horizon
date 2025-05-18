"use client";
import React, { useState, useEffect, useContext } from "react";
import AdminLayout from "@/app/components/admin-layout";
import { IOrganizer } from "@/app/types";
import { Box, TextField, Typography, Tabs, Tab, Switch } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import SnackBar from "@/app/components/snack-bar";
import { AuthContext } from "@/app/contexts/auth/auth-context";

const defaultColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    valueGetter: (params, row) =>
      row.last_name ? `${row.first_name} ${row.last_name}` : row.first_name,
    renderCell: (params: GridRenderCellParams<IOrganizer>) =>
      params.row.last_name
        ? `${params.row.first_name} ${params.row.last_name}`
        : params.row.first_name,
  },
  {
    field: "national_identity",
    headerName: "National Identity",
    flex: 1,
    renderCell: (params: GridRenderCellParams<IOrganizer>) =>
      params.row.national_identity,
  },
  {
    field: "contacts",
    headerName: "Contacts",
    flex: 1,
    renderCell: (params: GridRenderCellParams<IOrganizer>) =>
      params.row.user.contacts.join(","),
  },
];

async function fetchOrganizers(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { items: IOrganizer[]; count: number };
}

async function updateVendor(
  url: string,
  token: string,
  { arg }: { arg: { is_deleted: boolean; id: string } }
) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_deleted: arg.is_deleted }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Failed to update vendor");
  }

  return await response.json();
}

const AdminOrganizersPage = () => {
  const { snackbarToggle } = useContext(SnackbarContext);
  const { token } = useContext(AuthContext);

  const [organizers, setOrganizers] = useState<IOrganizer[]>([]);
  const [searchText, setSearchText] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const {
    data: _organizers = { items: [], count: 0 },
    mutate: refetchOrganizers,
  } = useSWR("/api/organizers", fetchOrganizers);

  const { isMutating, trigger: updateOrganizerStatus } = useSWRMutation(
    "/api/organizers",
    (url: string, { arg }: { arg: { is_deleted: boolean; id: string } }) =>
      updateVendor(url, token as string, { arg: arg }),
    {
      onSuccess: () => {
        refetchOrganizers();
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Status change successfully",
          severity: "success",
        });
      },
      onError: (error) => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: error.message,
          severity: "error",
        });
      },
    }
  );

  useEffect(() => {
    setOrganizers(_organizers.items);
  }, [_organizers]);

  useEffect(() => {
    if (isMutating) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isMutating, snackbarToggle]);

  const filteredOrganizers = organizers.filter((organizer) => {
    const name = organizer.last_name
      ? `${organizer.first_name} ${organizer.last_name}`
      : organizer.first_name;
    return name.toLowerCase().includes(searchText.toLowerCase());
  });

  const activeOrganizers = filteredOrganizers.filter(
    (organizer) => !organizer.is_deleted
  );
  const inactiveOrganizers = filteredOrganizers.filter(
    (organizer) => organizer.is_deleted
  );

  const handleSwitchChange = async (id: string, currentStatus: boolean) => {
    setOrganizers((prevOrganizers) =>
      prevOrganizers.map((organizer) =>
        organizer.id === id
          ? { ...organizer, is_deleted: !currentStatus }
          : organizer
      )
    );
    updateOrganizerStatus({ id: id, is_deleted: !currentStatus });
  };

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "right",
      headerAlign: "right",
      filterable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams<IOrganizer>) => (
        <Switch
          value={params.row.is_deleted}
          onChange={handleSwitchChange.bind(
            null,
            params.row.id,
            params.row.is_deleted ?? false
          )}
        />
      ),
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

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
          <Typography variant="h4">Organizers</Typography>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            sx={{
              width: 300,
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Box>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Active Organizers" sx={{ textTransform: "none" }} />
          <Tab label="Inactive Organizers" sx={{ textTransform: "none" }} />
        </Tabs>
        <Box sx={{ height: 500, width: "100%", mt: 2 }}>
          {tabIndex === 0 && (
            <DataGrid rows={activeOrganizers} columns={columns} />
          )}
          {tabIndex === 1 && (
            <DataGrid rows={inactiveOrganizers} columns={columns} />
          )}
        </Box>
      </AdminLayout>
    </>
  );
};

export default AdminOrganizersPage;
