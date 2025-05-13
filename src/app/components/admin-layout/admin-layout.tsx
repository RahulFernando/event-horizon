"use client";
import React from "react";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  People as VendorsIcon,
  LocalActivity as EventIcon,
} from "@mui/icons-material";
import AppTitle from "../app-title";
import { UserRound } from "lucide-react";
import AuthGuard from "@/app/guards/auth-guard";

const navigationItems = [
  { name: "Home", path: "/admin", icon: <HomeIcon /> },
  { name: "Vendors", path: "/admin/vendors", icon: <VendorsIcon /> },
  { name: "Organizers", path: "/admin/organizers", icon: <VendorsIcon /> },
  { name: "Events", path: "/admin/events", icon: <EventIcon /> },
];

const drawerWidth = 240;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AuthGuard userType="ADMIN">
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <Tooltip title="Profile" placement="left" arrow>
              <IconButton color="inherit" edge="end">
                <UserRound />
              </IconButton>
            </Tooltip>
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
    </AuthGuard>
  );
};

export default AdminLayout;
