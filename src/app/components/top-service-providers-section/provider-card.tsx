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

const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  title,
  src,
  ratings,
  onClick,
}) => {
  return (
    <Card variant="elevation" elevation={2} onClick={onClick.bind(null, id)}>
      <CardMedia
        component="img"
        alt={title}
        height="200"
        width="100%"
        image={src}
        style={{ objectFit: "contain", backgroundColor: "#F6F6F6" }}
      />
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
