import { Box, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";
import { WhatCustomerThinkProps } from "../../dashboard.types";

const WhatCustomerThink: React.FC<WhatCustomerThinkProps> = ({
  rating,
  isLoading = false,
}) => (
  <Stack
    direction="row"
    spacing={2}
    sx={{
      justifyContent: "flex-start",
      alignItems: "center",
    }}
  >
    <Box component="div" sx={{ width: "100px", textAlign: "center" }}>
      <Typography variant="h5">What Others Think About You</Typography>
    </Box>
    <Box
      component="div"
      sx={{
        p: 2,
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        bgcolor: "#fff",
        borderRadius: "8px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow:
            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>⭐</div>
        {!isLoading && <Typography variant="h5">{rating}</Typography>}
        {isLoading && <Skeleton variant="text" width={25} height={8} />}
      </Box>
      <div
        style={{
          width: "100px",
          textAlign: "center",
        }}
      >
        {!isLoading && (
          <Typography sx={{ mt: 2 }} variant="body2">
            Average Customer Ratings
          </Typography>
        )}
        {isLoading && (
          <Skeleton sx={{ mt: 2 }} variant="text" width={100} height={8} />
        )}
      </div>
    </Box>
  </Stack>
);

export default WhatCustomerThink;
