"use client";
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { MenuItemProps } from "../dashboard.types";
import { usePathname } from "next/navigation";
import Link from "next/link";

const MenuItemComponent: React.FC<MenuItemProps> = ({
  icon: Icon,
  text,
  href,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <MenuItem
      component={Link}
      href={href}
      sx={{
        backgroundColor: isActive ? "primary.main" : "transparent",
        color: isActive ? "white" : "inherit",
        "&:hover": {
          ...(isActive && { backgroundColor: "primary.dark" }),
          color: isActive ? "white" : "inherit",
        },
      }}
    >
      <ListItemIcon>
        <Icon sx={{ color: isActive ? "white" : "inherit" }} />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
};

export default MenuItemComponent;
