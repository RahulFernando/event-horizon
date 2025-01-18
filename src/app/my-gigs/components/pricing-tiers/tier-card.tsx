import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import numeral from "numeral";
import { TierCardProps } from "../../my-gigs.types";

const TierCard: React.FC<TierCardProps> = ({
  level,
  description,
  price,
  color,
}) => {
  return (
    <Card
      variant="elevation"
      sx={{
        borderRadius: "10px",
        position: "relative",
        minHeight: "150px",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "4px",
          backgroundColor: "primary.main",
        },
      }}
    >
      <CardContent>
        <Stack
          direction="column"
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ textTransform: "uppercase", color }}
          >
            {level}
          </Typography>
          <Typography variant="h3">
            {numeral(price).format("0,00")}{" "}
            <span style={{ fontSize: "12px", color: "#737373" }}>
              per month
            </span>
          </Typography>
          <Box component="div" mt={4}>
            <Typography variant="body1">{description}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TierCard;
