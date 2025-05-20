"use client";
import React, { useContext, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { CiEdit } from "react-icons/ci";
import { CiViewList } from "react-icons/ci";
import NonEditablePersonalInfo from "./non-editable-personal-info";
import { IUserInfo } from "@/app/types";
import useSWR from "swr";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import EditablePersonalInfo from "./editable-personal-info";

async function fetchUser(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IUserInfo;
}

const PersonaInfo = () => {
  const theme = useTheme();
  const { account } = useContext(AuthContext);

  const [editable, setEditable] = useState(false);

  const { data: user, mutate } = useSWR(
    `/api/users/${account?.user.id}`,
    fetchUser
  );

  const editIconClickHandler = () => setEditable((prev) => !prev);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",
        boxSizing: "border-box",
      }}
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
            Personal Information
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
      {!editable && <NonEditablePersonalInfo user={user} />}
      {editable && <EditablePersonalInfo user={user} refetchUser={mutate} />}
    </Paper>
  );
};

export default PersonaInfo;
