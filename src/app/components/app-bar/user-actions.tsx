"use client";
import React, { MouseEvent, useContext, useState } from "react";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import {
  Avatar,
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  useTheme,
} from "@mui/material";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Link from "next/link";
import MenuItem from "./menu-item";
import { useRouter } from "next/navigation";

const UserActions = () => {
  const { token, account, signOut } = useContext(AuthContext);
  const theme = useTheme();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getLinkAndLabel = () => {
    if (account) {
      if (account.user.vendors) {
        return {
          href: "/vendor/dashboard",
          label: "Dashboard",
        };
      }
      if (account.user.organizers) {
        return {
          href: "/my-events",
          label: "My Events",
        };
      }
    }
    return { href: "", label: "" };
  };

  const { href, label } = getLinkAndLabel();

  const profileClickHandler = () => router.push("/profile");

  const signOutClickHandler = () => {
    handleClose();
    signOut();
  };

  return (
    <>
      {token && (
        <Button
          LinkComponent={Link}
          href={href}
          sx={{
            my: 2,
            color: "white",
            display: "block",
            fontSize: "15px",
          }}
        >
          {label}
        </Button>
      )}
      {token && (
        <Button
          LinkComponent={Link}
          href="/tickets"
          sx={{
            my: 2,
            color: "white",
            display: "block",
            fontSize: "15px",
          }}
        >
          Tickets
        </Button>
      )}
      {!token && (
        <Button
          LinkComponent={Link}
          href="/auth/sign-in"
          sx={{
            my: 2,
            ml: 1,
            color: "white",
            display: "block",
            fontSize: "15px",
            bgcolor: "secondary.dark",
            borderColor: "secondary.dark",
          }}
          variant="contained"
        >
          Log In
        </Button>
      )}
      {token && (
        <Box component="div" onClick={handleClick}>
          <Avatar
            sx={{
              mt: 1.5,
              ml: 1,
              border: `2px solid ${theme.palette.background.default}`,
              boxShadow: theme.shadows[3],
              bgcolor: theme.palette.primary.light,
              "&:hover": {
                boxShadow: theme.shadows[6],
                cursor: "pointer",
              },
            }}
          >
            {account?.user.name.charAt(0)}
          </Avatar>
        </Box>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={handleClose}
      >
        <MenuItem onClick={profileClickHandler}>
          <ListItemIcon>
            <PermIdentityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ ml: -1 }}>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={signOutClickHandler}>
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ ml: -1 }}>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserActions;
