"use client";
import React, { useState, useEffect, useContext } from "react";
import AdminLayout from "@/app/components/admin-layout";
import { IVendor } from "@/app/types";
import { Box, TextField, Typography, Tabs, Tab, Switch } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import SnackBar from "@/app/components/snack-bar";

const defaultColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    valueGetter: (params, row) => row.user.name,
    renderCell: (params: GridRenderCellParams<IVendor>) => params.row.user.name,
  },
  {
    field: "contacts",
    headerName: "Contacts",
    flex: 1,
    renderCell: (params: GridRenderCellParams<IVendor>) =>
      params.row.user.contacts?.join(", "),
  },
  {
    field: "business_registration",
    headerName: "Business Registration Number",
    flex: 1,
    renderCell: (params: GridRenderCellParams<IVendor>) =>
      params.row.business_registration ?? "N/A",
  },
  {
    field: "taxpayer_identification_number",
    headerName: "Taxpayer Identification Number",
    flex: 1,
    renderCell: (params: GridRenderCellParams<IVendor>) =>
      params.row.taxpayer_identification_number ?? "N/A",
  },
];

async function fetchVendors() {
  const response = await fetch("/api/vendors");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { items: IVendor[]; count: number };
}

async function updateVendor(
  url: string,
  { arg }: { arg: { is_deleted: boolean; id: string } }
) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "PATCH",
    headers: {
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

const AdminVendorsPage = () => {
  const { snackbarToggle } = useContext(SnackbarContext);

  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [searchText, setSearchText] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const { data: _vendors = { items: [], count: 0 }, mutate: refetchVendors } =
    useSWR("/api/vendors", fetchVendors);

  const { isMutating, trigger: updateVendorStatus } = useSWRMutation(
    "/api/vendors",
    updateVendor,
    {
      onSuccess: () => {
        refetchVendors();
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
    setVendors(_vendors.items);
  }, [_vendors]);

  useEffect(() => {
    if (isMutating) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isMutating, snackbarToggle]);

  const filteredVendors = vendors.filter((vendor) =>
    vendor.user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const activeVendors = filteredVendors.filter((vendor) => !vendor.is_deleted);
  const inactiveVendors = filteredVendors.filter((vendor) => vendor.is_deleted);

  const handleSwitchChange = async (id: string, currentStatus: boolean) => {
    setVendors((prevVendors) =>
      prevVendors.map((vendor) =>
        vendor.id === id ? { ...vendor, is_deleted: !currentStatus } : vendor
      )
    );
    updateVendorStatus({ id: id, is_deleted: !currentStatus });
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
      renderCell: (params: GridRenderCellParams<IVendor>) => (
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
          <Typography variant="h4">Vendors</Typography>
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
          <Tab label="Active Vendors" sx={{ textTransform: "none" }} />
          <Tab label="Inactive Vendors" sx={{ textTransform: "none" }} />
        </Tabs>
        <Box sx={{ height: 500, width: "100%", mt: 2 }}>
          {tabIndex === 0 && (
            <DataGrid rows={activeVendors} columns={columns} />
          )}
          {tabIndex === 1 && (
            <DataGrid rows={inactiveVendors} columns={columns} />
          )}
        </Box>
      </AdminLayout>
    </>
  );
};

export default AdminVendorsPage;
