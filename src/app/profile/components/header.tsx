"use client";
import React, { useContext, useState } from "react";
import {
  Avatar,
  Paper,
  Stack,
  Typography,
  Box,
  useTheme,
  Tooltip,
  Chip,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { AuthContext } from "@/app/contexts/auth/auth-context";

const Header = () => {
  const theme = useTheme();
  const { account } = useContext(AuthContext);

  const [isHovered, setIsHovered] = useState(false);

  const firstLetterOfName = account?.user.name.charAt(0);

  const getUserType = () => {
    if (account) {
      switch (account.user.user_type) {
        case "ADMIN":
          return "Admin";
        case "ORGANIZER":
          return "Organizer";
        case "VENDOR":
          return "Vendor";
        default:
          return "Customer Support Representative";
      }
    }
    return "N/A";
  };

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
      <Stack
        direction="row"
        spacing={3}
        sx={{ justifyContent: "flex-start", alignItems: "center" }}
      >
        <Tooltip
          title="Coming soon.."
          placement="top-start"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                fontSize: 14,
              },
            },
          }}
        >
          <Box
            position="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Avatar
              sx={{
                width: 84,
                height: 84,
                bgcolor: isHovered
                  ? theme.palette.primary.main
                  : theme.palette.primary.light,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isHovered ? (
                <CameraAltIcon fontSize="large" />
              ) : (
                <Typography variant="h1">
                  {firstLetterOfName ?? "N/A"}
                </Typography>
              )}
            </Avatar>
          </Box>
        </Tooltip>
        <Stack
          direction="column"
          spacing={0.3}
          sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <Typography variant="h5">{account?.user.name}</Typography>
          <Chip
            color="secondary"
            sx={{
              color: theme.palette.secondary.contrastText,
              fontWeight: 600,
            }}
            label={getUserType()}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Header;
