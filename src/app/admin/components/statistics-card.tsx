"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  SxProps,
  Theme,
} from "@mui/material";
import CountUp from "react-countup";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: string;
  sx?: SxProps<Theme>;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  sx = {},
}) => (
  <Card
    sx={{
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      ...sx,
    }}
  >
    <CardContent>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <img src={icon} height="64px" width="64px" alt={icon} />

        <Typography
          variant="h2"
          component="div"
          fontWeight="bold"
          color="primary.main"
        >
          <CountUp
            end={typeof value === "number" ? value : parseFloat(value)}
            duration={2}
          />
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default StatisticsCard;
