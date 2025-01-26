import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import { CategoryCardProps } from "./categories-section.types";

const CategoryCard: React.FC<CategoryCardProps> = ({ name, img_url }) => (
  <Card variant="elevation" elevation={2}>
    <CardMedia
      component="img"
      alt={name}
      height="140"
      image={img_url ?? "/images/no-picture-available.jpg"}
    />
    <CardContent>
      <Typography gutterBottom variant="body1">
        {name}
      </Typography>
    </CardContent>
  </Card>
);

export default CategoryCard;
