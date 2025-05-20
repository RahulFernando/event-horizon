"use client";
import React, { useContext } from "react";
import {
  TextField,
  Grid2,
  IconButton,
  Typography,
  Checkbox,
  Box,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  EditablePersonalInfoProps,
  PersonalInfoArgs,
  PersonalInfoFormInputs,
} from "../profile.types";
import useSWRMutation from "swr/mutation";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";

const DEFAULT_ADDRESS = {
  number: "",
  line_1: "",
  state: "",
  country: "",
  postal_code: "",
  is_default: false,
};

async function updatePersonalInfo(
  url: string,
  token: string,
  { args }: { args: PersonalInfoArgs }
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

const EditablePersonalInfo: React.FC<EditablePersonalInfoProps> = ({
  user,
  refetchUser,
}) => {
  const { token } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const defaultAddresses = user
    ? (user.addresses ?? []).map(
        ({
          id,
          number,
          line_1,
          line_2,
          state,
          country,
          postal_code,
          is_default,
        }) => ({
          addressId: id,
          number: number ?? "",
          line_1,
          line_2: line_2 ?? "",
          state: state ?? "",
          country,
          postal_code,
          is_default: is_default ?? false,
        })
      )
    : [
        {
          number: "",
          line_1: "",
          state: "",
          country: "",
          postal_code: "",
          default: false,
        },
      ];

  const defaultContacts = user
    ? user.contacts.map((contact) => ({ phone: contact }))
    : [{ phone: "" }];

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<PersonalInfoFormInputs>({
    defaultValues: {
      name: user?.name ?? "",
      contacts: defaultContacts,
      addresses: defaultAddresses,
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: _removeContact,
  } = useFieldArray({
    control,
    name: "contacts",
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: _removeAddress,
    update: updateAddressFields,
  } = useFieldArray({
    control,
    name: "addresses",
  });

  const { isMutating, trigger: updateUserInfo } = useSWRMutation(
    user && `/api/users/${user.id}`,
    (url: string, { arg }: { arg: PersonalInfoArgs }) =>
      updatePersonalInfo(url, token as string, { args: arg }),
    {
      onSuccess: () => {
        refetchUser();
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Personal info changed successfully",
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

  const appendNewContact = () => appendContact({ phone: "" });

  const removeContact = (index: number) => _removeContact(index);

  const appendNewAddress = () => appendAddress(DEFAULT_ADDRESS);

  const removeAddress = (index: number) => _removeAddress(index);

  const defaultAddressChangeHandler = () => {
    const previousDefaultAddress = addressFields.findIndex(
      (address) => address.is_default
    );
    if (previousDefaultAddress > -1) {
      updateAddressFields(previousDefaultAddress, {
        ...addressFields[previousDefaultAddress],
        is_default: false,
      });
      return true;
    }

    return true;
  };

  const submitHandler = (values: PersonalInfoFormInputs) => {
    const { contacts, ...rest } = values;
    const phoneNumbers = contacts.map(({ phone }) => phone);
    console.log(rest.addresses);
    updateUserInfo({
      ...rest,
      contacts: phoneNumbers,
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)}>
      <Grid2 container spacing={1}>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Name"
            required
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid2>
        {contactFields.map((item, index) => (
          <Grid2 key={index} size={{ xs: 6, md: 3 }}>
            <Grid2 container spacing={0.5}>
              <Grid2 size={{ xs: 11 }}>
                <Controller
                  name={`contacts.${index}.phone`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required={index === 0 && true}
                      label="Phone Number"
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={
                        errors.contacts
                          ? Boolean(errors.contacts[index]?.message)
                          : false
                      }
                      helperText={
                        errors.contacts && errors.contacts[index]?.message
                      }
                    />
                  )}
                  rules={{
                    required: index === 0 ? "Phone number is required" : false,
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 1 }}>
                {index === 0 && (
                  <IconButton size="small" onClick={appendNewContact}>
                    <AddIcon />
                  </IconButton>
                )}
                {index > 0 && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={removeContact.bind(null, index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </Grid2>
            </Grid2>
          </Grid2>
        ))}
        <Grid2 size={{ xs: 12 }} sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Address
          </Typography>
        </Grid2>
        {addressFields.map((item, index) => (
          <Grid2 key={item.id} size={{ xs: 12 }}>
            <Grid2 container spacing={1}>
              <Grid2 size={{ xs: 4 }}>
                <Controller
                  name={`addresses.${index}.number`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Number"
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 8 }}>
                <Controller
                  name={`addresses.${index}.line_1`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Line 1"
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Controller
                  name={`addresses.${index}.line_2`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Line 2"
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Controller
                  name={`addresses.${index}.state`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="State"
                      fullWidth
                      required
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Controller
                  name={`addresses.${index}.country`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Country"
                      required
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 3 }}>
                <Controller
                  name={`addresses.${index}.postal_code`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Postal Code"
                      fullWidth
                      required
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 2 }}>
                <Controller
                  name={`addresses.${index}.is_default`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => {
                        if (defaultAddressChangeHandler()) {
                          field.onChange(e.target.checked);
                        }
                      }}
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 1 }}>
                {index === 0 && (
                  <IconButton size="small" onClick={appendNewAddress}>
                    <AddIcon />
                  </IconButton>
                )}
                {index > 0 && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={removeAddress.bind(null, index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </Grid2>
            </Grid2>
          </Grid2>
        ))}
      </Grid2>
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
    </form>
  );
};

export default EditablePersonalInfo;
