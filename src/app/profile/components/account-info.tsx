"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  useTheme,
  Divider,
  Box,
  Grid2,
  IconButton,
  Tooltip,
  TextField,
  Button,
} from "@mui/material";
import { CiEdit } from "react-icons/ci";
import { CiViewList } from "react-icons/ci";
import LabelWithValue from "@/app/admin/events/components/label-with-value";
import { IUserInfo } from "@/app/types";
import useSWR from "swr";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import EditableOrganizerAccount from "./editable-organizer-account";
import {
  OrganizerAccountFormInputs,
  VendorAccountFormInputs,
} from "../profile.types";
import { useForm } from "react-hook-form";
import EditableVendorAccount from "./editable-vendor-account";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";

async function fetchUser(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IUserInfo;
}

async function updateVendor(
  url: string,
  token: string,
  { args }: { args: VendorAccountFormInputs }
) {
  const response = await fetch(url, {
    method: "PUT",
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

async function updateOrganizer(
  url: string,
  token: string,
  { args }: { args: OrganizerAccountFormInputs }
) {
  const response = await fetch(url, {
    method: "PUT",
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

const AccountInfo = () => {
  const { account, token } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);
  const theme = useTheme();

  const [editable, setEditable] = useState(false);

  const editIconClickHandler = () => setEditable((prev) => !prev);

  const { data: user, mutate: refetchUser } = useSWR(
    `/api/users/${account?.user.id}`,
    fetchUser
  );

  const { isMutating: isVendorUpdating, trigger: vendorUpdate } =
    useSWRMutation(
      user && user.vendors && `/api/vendors/${user.vendors.id}`,
      (url: string, { arg }: { arg: VendorAccountFormInputs }) =>
        updateVendor(url, token as string, { args: arg }),
      {
        onSuccess: () => {
          refetchUser();
          snackbarToggle(ActionKind.OPEN, {
            open: true,
            message: "Account info changed successfully",
            severity: "success",
          });
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

  const { isMutating: isOrganizerUpdating, trigger: organizerUpdate } =
    useSWRMutation(
      user && user.organizers && `/api/organizers/${user.organizers.id}`,
      (url: string, { arg }: { arg: OrganizerAccountFormInputs }) =>
        updateOrganizer(url, token as string, { args: arg }),
      {
        onSuccess: () => {
          refetchUser();
          snackbarToggle(ActionKind.OPEN, {
            open: true,
            message: "Account info changed successfully",
            severity: "success",
          });
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

  const {
    register: organizerRegister,
    formState: organizerFormState,
    handleSubmit: organizerHandlerSubmit,
    reset: resetOrganizerForm,
  } = useForm<OrganizerAccountFormInputs>({
    defaultValues: {
      first_name: "",
      last_name: "",
      national_identity: "",
    },
  });

  const {
    register: vendorRegister,
    formState: vendorFormState,
    handleSubmit: vendorHandlerSubmit,
    reset: resetVendorForm,
  } = useForm<VendorAccountFormInputs>({
    defaultValues: {
      business_registration: "",
      taxpayer_identification_number: "",
    },
  });

  const isMutating = isVendorUpdating || isOrganizerUpdating;

  useEffect(() => {
    if (user && user.organizers) {
      resetOrganizerForm({
        first_name: user.organizers.first_name,
        last_name: user.organizers.last_name ?? "",
        national_identity: user.organizers.national_identity ?? "",
      });
    }
  }, [resetOrganizerForm, user]);

  useEffect(() => {
    if (user && user.vendors) {
      resetVendorForm({
        business_registration: user.vendors.business_registration ?? "",
        taxpayer_identification_number:
          user.vendors.taxpayer_identification_number ?? "",
      });
    }
  }, [resetVendorForm, user]);

  const getOtherInformation = () => {
    if (!user) return null;

    if (user.user_type === "ORGANIZER") {
      return (
        <>
          <Grid2 size={{ xs: 6, md: 3 }}>
            <LabelWithValue
              label="First Name"
              value={user?.organizers?.first_name ?? "----"}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 3 }}>
            <LabelWithValue
              label="First Name"
              value={user?.organizers?.last_name ?? "----"}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <LabelWithValue
              label="NIC"
              value={user?.organizers?.national_identity ?? "N/A"}
            />
          </Grid2>
        </>
      );
    }

    if (user.user_type === "VENDOR") {
      return (
        <>
          <Grid2 size={{ xs: 6 }}>
            <LabelWithValue
              label="Business Registration"
              value={user?.vendors?.business_registration ?? "N/A"}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <LabelWithValue
              label="TIN"
              value={user?.vendors?.taxpayer_identification_number ?? "N/A"}
            />
          </Grid2>
        </>
      );
    }

    return null;
  };

  const submitHandler = (
    values: OrganizerAccountFormInputs | VendorAccountFormInputs
  ) => {
    if (user && user.user_type === "VENDOR") {
      vendorUpdate(values as VendorAccountFormInputs);
      return;
    }
    organizerUpdate(values as OrganizerAccountFormInputs);
  };

  const getEditableAccountInfo = () => {
    if (!user) return null;

    if (user.user_type === "ORGANIZER") {
      return (
        <EditableOrganizerAccount
          register={organizerRegister}
          errors={organizerFormState.errors}
        />
      );
    }

    if (user.user_type === "VENDOR") {
      return (
        <EditableVendorAccount
          register={vendorRegister}
          errors={vendorFormState.errors}
        />
      );
    }

    return null;
  };

  return (
    <Paper
      component="form"
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",
        boxSizing: "border-box",
      }}
      onSubmit={
        user && user.user_type === "ORGANIZER"
          ? organizerHandlerSubmit(submitHandler)
          : vendorHandlerSubmit(submitHandler)
      }
    >
      <Box component="div" sx={{ mb: 2 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Account Information
          </Typography>
          <IconButton size="large" onClick={editIconClickHandler}>
            {!editable && (
              <Tooltip title="Edit" placement="right-end">
                <CiEdit />
              </Tooltip>
            )}
            {editable && (
              <Tooltip title="View" placement="right-end">
                <CiViewList />
              </Tooltip>
            )}
          </IconButton>
        </Stack>
        <Divider sx={{ mt: 1 }} />
      </Box>
      <Grid2 container spacing={1}>
        <Grid2 size={{ xs: 6 }}>
          {editable && (
            <TextField
              fullWidth
              size="small"
              label="Email"
              defaultValue={(user && user.account.email) ?? ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          )}
          {!editable && (
            <LabelWithValue
              label="Email"
              value={
                user && user.account
                  ? user.account.email
                  : "something@went.wrong"
              }
            />
          )}
        </Grid2>
        {!editable && getOtherInformation()}
        {editable && getEditableAccountInfo()}
      </Grid2>
      {editable && (
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            pt: 4,
          }}
        >
          <Button type="submit" disabled={isMutating} variant="contained">
            {!isMutating && "Update"}
            {isMutating && "Please wait.."}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default AccountInfo;
