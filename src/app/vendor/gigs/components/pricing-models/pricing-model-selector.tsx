import React from "react";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { PRICING_MODEL_TYPES } from "../../constants";
import { ModelSelectorProps } from "../../my-gigs.types";
import { toTitleCase } from "@/lib/utils/to-title-case";
import ModelSelectorSkeleton from "./model-selector-skeleton";

const ModelSelector: React.FC<ModelSelectorProps> = ({
  pricingModel,
  isLoading,
  onPricingModelChange,
}) => {
  const theme = useTheme();

  if (isLoading) {
    return <ModelSelectorSkeleton />;
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {PRICING_MODEL_TYPES.map(({ name, src }) => (
        <Box
          component="div"
          key={name}
          sx={{
            p: 3,
            border:
              pricingModel === name
                ? `3px ${theme.palette.primary.main} solid`
                : "1px #ababab solid",
            minWidth: "60px",
            borderRadius: "6px",
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
            ":hover": {
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            },
          }}
          onClick={onPricingModelChange.bind(null, name)}
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
            <Avatar
              src={src}
              variant="square"
              sx={{
                width: 40,
                height: 40,
                transition: "transform 0.3s ease",
                ":hover": {
                  transform: "scale(1.2)",
                },
              }}
            />
            <Typography
              variant="subtitle1"
              color={pricingModel === name ? "primary" : "textPrimary"}
            >
              {toTitleCase(name)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

export default ModelSelector;
