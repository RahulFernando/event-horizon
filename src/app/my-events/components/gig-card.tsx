"use client";
import React from "react";
import {
  Box,
  // Button,
  Card,
  // CardActions,
  CardHeader,
  CardMedia,
  Tooltip,
  Typography,
} from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import { GigCardProps } from "../events.type";
// import useSWR from "swr";
// import { IPricing } from "@/app/types";

// async function fetchPricing(url: string) {
//   const response = await fetch(url);

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error?.message || "Something went wrong");
//   }

//   return (await response.json()) as IPricing;
// }

const GigCard: React.FC<GigCardProps> = ({
  id,
  title,
  vendor,
  // onAddClick,
  onClick,
}) => {
  // const { data: pricing } = useSWR(
  //   id ? `/api/gigs/${id}/pricings` : null,
  //   fetchPricing
  // );

  // const isDisable = pricing && pricing.tiered?.id ? true : false;

  const gigTitle = title.length > 30 ? `${title.slice(0, 30)}...` : title;

  return (
    <Box
      component="div"
      onClick={onClick.bind(null, id)}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Card
        variant="elevation"
        elevation={2}
        sx={{
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          maxHeight: "300px",
          overflow: "hidden",
        }}
      >
        <CardHeader
          title={
            <Tooltip title={title} placement="bottom">
              <Typography
                variant="h6"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {gigTitle}
              </Typography>
            </Tooltip>
          }
          subheader={vendor.user.name}
        />
        <CardMedia
          component="img"
          sx={{
            height: 120,
            objectFit: "cover",
          }}
          image="/images/no-picture-available.jpg"
          alt="gig-image"
        />
        {/* <CardActions
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            disabled={isDisable}
            startIcon={<AddIcon />}
            onClick={onAddClick.bind(null, id)}
          >
            {!isDisable && "Add"}
            {isDisable && "Select pricing tier"}
          </Button>
        </CardActions> */}
      </Card>
    </Box>
  );
};

export default GigCard;
