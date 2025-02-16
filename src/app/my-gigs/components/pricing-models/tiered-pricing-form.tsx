import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import { ITier, TieredPriceModelPayload } from "../../my-gigs.types";
import PricingTiers from "../pricing-tiers";
import { indigo } from "@mui/material/colors";
import { IPricing } from "@/app/types";
import { useParams } from "next/navigation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import SnackBar from "@/app/components/snack-bar";
import { getColorShade } from "@/lib/utils/get-color-shade";

async function fetchPrice(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IPricing;
}

async function createPricingModel(
  url: string,
  { arg }: { arg: TieredPriceModelPayload }
) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IPricing;
}

const baseShade = 200;

const TieredPricingForm = () => {
  const params = useParams();

  const { snackbarToggle } = useContext(SnackbarContext);

  const [tiers, setTiers] = useState<ITier[]>([
    {
      index: 0,
      level: "Basic",
      description: "This is basic tier",
      price: 1000,
      color: indigo[baseShade],
    },
  ]);

  const {
    isMutating,
    error,
    data,
    trigger: createPricing,
  } = useSWRMutation(`/api/gigs/${params.id}/pricings`, createPricingModel);

  const { data: pricingModel } = useSWR(
    `/api/gigs/${params.id}/pricings`,
    fetchPrice
  );

  useEffect(() => {
    if (pricingModel && pricingModel.tiered) {
      const { pricing_tiers } = pricingModel.tiered;
      setTiers(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pricing_tiers.map(({ id, ...tier }, index) => {
          const shade = getColorShade(index, baseShade);
          return {
            index,
            color: indigo[shade as keyof typeof indigo],
            ...tier,
          };
        })
      );
    }
  }, [pricingModel]);

  useEffect(() => {
    if (error) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  }, [error, snackbarToggle]);

  useEffect(() => {
    if (data) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Pricing model created",
        severity: "success",
      });
    }
  }, [data, snackbarToggle]);

  const addNewTier = () => {
    const last = tiers[tiers.length - 1];
    const shade = getColorShade(tiers.length, baseShade);
    setTiers((prev) => [
      ...prev,
      {
        index: last.index + 1,
        level: "",
        description: "",
        price: 1000,
        color: indigo[shade as keyof typeof indigo],
      },
    ]);
  };

  const removeTier = (index: number) =>
    setTiers((prev) => [...prev.filter((tier) => tier.index !== index)]);

  const inputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const propertyName = name.split("-")[0];
    const index = name.split("-")[1];

    setTiers((prev) => [
      ...prev.map((tier) => {
        if (tier.index === +index) {
          return {
            ...tier,
            [propertyName]: value,
          };
        }

        return { ...tier };
      }),
    ]);
  };

  const resetHandler = () =>
    setTiers([
      {
        index: 0,
        level: "Basic",
        description: "This is basic tier",
        price: 1000,
        color: indigo[baseShade],
      },
    ]);

  const submitHandler = () => {
    createPricing({
      type: "TIERED",
      tiered: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pricingTiers: tiers.map(({ color, index, price, ...tier }) => ({
          ...tier,
          price: +price,
        })),
      },
    });
  };

  return (
    <>
      <SnackBar />
      <Grid2 container spacing={2}>
        {tiers.map(({ index, ...tier }) => (
          <Grid2 key={index} size={{ xs: 12 }}>
            <Stack
              spacing={1}
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <TextField
                sx={{ flex: 2 }}
                label="Level"
                fullWidth
                size="small"
                name={`level-${index}`}
                value={tier.level}
                onChange={inputChangeHandler}
              />
              <TextField
                sx={{ flex: 4 }}
                label="Description"
                placeholder="You can define the features"
                defaultValue={tier.description}
                fullWidth
                size="small"
                name={`description-${index}`}
                value={tier.description}
                onChange={inputChangeHandler}
              />
              <TextField
                sx={{ flex: 2 }}
                label="Price"
                defaultValue={tier.price}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">per month</InputAdornment>
                    ),
                  },
                }}
                name={`price-${index}`}
                value={tier.price}
                onChange={inputChangeHandler}
              />
              {tier.level !== "Basic" && (
                <IconButton
                  sx={{ flex: 1 }}
                  size="small"
                  color="error"
                  onClick={removeTier.bind(null, index)}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </Stack>
          </Grid2>
        ))}
        <Grid2
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={addNewTier}
            >
              Tier
            </Button>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }} mt={2}>
          <PricingTiers
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            tiers={tiers.map(({ index, ...tier }) => ({ ...tier }))}
          />
        </Grid2>
      </Grid2>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Button variant="outlined" size="small" onClick={resetHandler}>
          Reset
        </Button>
        <Button
          type="button"
          variant="contained"
          size="small"
          disabled={isMutating}
          onClick={submitHandler}
        >
          {!isMutating && "Submit"}
          {isMutating && "Please wait..."}
        </Button>
      </Stack>
    </>
  );
};

export default TieredPricingForm;
