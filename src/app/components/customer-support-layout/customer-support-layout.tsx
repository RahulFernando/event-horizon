"use client";
import React, { MouseEvent, useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { People as VendorsIcon } from "@mui/icons-material";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AppTitle from "../app-title";
import AuthGuard from "@/app/guards/auth-guard";
import { AuthContext } from "@/app/contexts/auth/auth-context";

const navigationItems = [
  // { name: "Home", path: "/customer-support", icon: <HomeIcon /> },
  { name: "Tickets", path: "/customer-support/tickets", icon: <VendorsIcon /> },
];

const drawerWidth = 240;

const CustomerSupportLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { account, signOut } = useContext(AuthContext);

  const router = useRouter();
  const pathname = usePathname();

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const profileClickHandler = () => router.push("/customer-support/profile");

  return (
    <AuthGuard userType="CUSTOMER_SUPPORT_REPRESENTATIVE">
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <Box component="div" onClick={handleClick}>
              <Avatar
                sx={{
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
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <AppTitle
              sx={{
                display: { xs: "none", md: "flex", color: "#AB4459" },
                textDecoration: "none",
              }}
              variant="h3"
            />
          </Toolbar>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.name}
                onClick={() => router.push(item.path)}
                sx={{
                  backgroundColor:
                    pathname === item.path ? "primary.main" : "inherit",
                  color:
                    pathname === item.path ? "primary.contrastText" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      pathname === item.path ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      pathname === item.path
                        ? "primary.contrastText"
                        : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginTop: "64px", // Height of the AppBar
          }}
        >
          {children}
        </Box>
      </Box>

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
        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ ml: -1 }}>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </AuthGuard>
  );
};

export default CustomerSupportLayout;
