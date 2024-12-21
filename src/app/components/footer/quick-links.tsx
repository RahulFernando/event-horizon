import { List, ListItem, ListItemText } from "@mui/material";
import Link from "next/link";
import React from "react";

const links = [
  { primary: "Clients", href: "/clients" },
  { primary: "About Us", href: "/about-us" },
  { primary: "Public Events", href: "/public-events" },
];

const QuickLinks = () => (
  <List>
    {links.map(({ primary, href }) => (
      <ListItem key={primary} disablePadding>
        <Link href={href} style={{ textDecoration: "none", color: "black" }}>
          <ListItemText primary={primary} />
        </Link>
      </ListItem>
    ))}
  </List>
);

export default QuickLinks;
