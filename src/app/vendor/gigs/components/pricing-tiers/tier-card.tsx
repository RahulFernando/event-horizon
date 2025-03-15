import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import numeral from "numeral";
import { TierCardProps } from "../../my-gigs.types";

const TierCard: React.FC<TierCardProps> = ({
  level,
  description,
  price,
  color,
  id,
  selectedTierId,
  onSelect,
}) => (
  <Card
    variant="elevation"
    sx={{
      borderRadius: "10px",
      position: "relative",
      minHeight: "150px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
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
          <span style={{ fontSize: "12px", color: "#737373" }}>per month</span>
        </Typography>
        <Box component="div" mt={4}>
          <Typography variant="body1">{description}</Typography>
        </Box>
      </Stack>
      {onSelect && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button
            variant={selectedTierId === id ? "contained" : "outlined"}
            size="small"
            color="secondary"
            onClick={onSelect.bind(null, id as string)}
          >
            Choose
          </Button>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default TierCard;
