"use client";
import React from "react";
import {
  Container,
  AppBar as MuiAppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import AppTitle from "../app-title";
import Link from "next/link";

const pages = [
  { title: "Book Provider", href: "/book-provider" },
  { title: "Clients", href: "/clients" },
  { title: "About Us", href: "/about-us" },
];

const AppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <MuiAppBar position="fixed">
      <Container maxWidth={false} sx={{ bgcolor: "primary.main" }}>
        <Toolbar disableGutters>
          <AppTitle
            sx={{ display: { xs: "none", md: "flex", color: "white" } }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title}>
                  <Link
                    href={page.href}
                    style={{
                      color: "black",
                      fontSize: "13px",
                      textDecoration: "none",
                    }}
                  >
                    {page.title}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              ml: { md: 4, xl: 8 },
            }}
          >
            {pages.map((page) => (
              <Button
                LinkComponent={Link}
                href={page.href}
                key={page.title}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  fontSize: "14px",
                  ...(page.title === "Book Provider" && { fontWeight: 600 }),
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: "flex" }}>
            <Button
              LinkComponent={Link}
              href="/apply-as-a-provider"
              sx={{
                my: 2,
                color: "white",
                display: "block",
                fontSize: "15px",
              }}
            >
              Apply as a Provider
            </Button>
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
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};

export default AppBar;
