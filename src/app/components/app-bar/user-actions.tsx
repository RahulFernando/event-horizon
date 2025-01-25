"use client";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { Button } from "@mui/material";
import Link from "next/link";
import React, { useContext } from "react";

const UserActions = () => {
  const { token, account } = useContext(AuthContext);

  const getLinkAndLabel = () => {
    if (token && account) {
      if (account.user.vendors) {
        return {
          href: "/my-gigs",
          label: "My Gigs",
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

  return (
    <>
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
      {!token && (
        <Button
          LinkComponent={Link}
          href="/auth/sign-in"
          sx={{
            my: 2,
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
        <Button
          sx={{
            my: 2,
            ml: 1,
            color: "white",
            display: "block",
            fontSize: "15px",
            bgcolor: "warning",
          }}
          variant="contained"
        >
          Log Out
        </Button>
      )}
    </>
  );
};

export default UserActions;
