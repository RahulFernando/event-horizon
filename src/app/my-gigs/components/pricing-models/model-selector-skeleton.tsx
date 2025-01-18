import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";

const ModelSelectorSkeleton = () => (
  <Stack
    direction="row"
    spacing={2}
    sx={{
      justifyContent: "flex-start",
      alignItems: "center",
    }}
  >
    {[1, 2, 3].map((model) => (
      <Box
        component="div"
        key={model}
        sx={{
          p: 3,
          border: "1px #ababab solid",
          minWidth: "60px",
          borderRadius: "6px",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          ":hover": {
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={30} height={10} />
        </Box>
      </Box>
    ))}
  </Stack>
);

export default ModelSelectorSkeleton;
