import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const categories = ["Caterin", "Venue", "Entertainment"];

const Categories = () => {
  return (
    <List>
      {categories.map((category) => (
        <ListItem key={category} disablePadding>
          <ListItemText primary={category} />
        </ListItem>
      ))}
    </List>
  );
};

export default Categories;
