import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import { CategoryCardProps } from "./categories-section.types";

const CategoryCard: React.FC<CategoryCardProps> = ({ title, src }) => {
  return (
    <Card variant="elevation" elevation={2}>
      <CardMedia component="img" alt={title} height="140" image={src} />
      <CardContent>
        <Typography gutterBottom variant="body1">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
