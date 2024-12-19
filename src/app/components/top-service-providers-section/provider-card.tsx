import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import { ProviderCardProps } from "./provider-card.types";

const ProviderCard: React.FC<ProviderCardProps> = ({ title, src, ratings }) => {
  return (
    <Card variant="elevation" elevation={2}>
      <CardMedia component="img" alt={title} height="140" image={src} />
      <CardContent>
        <Typography gutterBottom variant="body1">
          {title}
        </Typography>
      </CardContent>
      <CardActionArea>
        <Rating value={ratings} precision={0.5} readOnly />
      </CardActionArea>
    </Card>
  );
};

export default ProviderCard;
