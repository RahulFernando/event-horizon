import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GigCardProps } from "../events.type";

const GigCard: React.FC<GigCardProps> = ({ title, vendor }) => {
  return (
    <Card variant="elevation" elevation={2}>
      <CardHeader title={title} subheader={vendor.user.name} />
      <CardMedia
        component="img"
        height={100}
        image="/images/no-picture-available.jpg"
        alt="gig-image"
      />
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button startIcon={<AddIcon />}>Add</Button>
      </CardActions>
    </Card>
  );
};

export default GigCard;
