"use client";
import React, { useContext, useEffect } from "react";
import {
  Button,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";

import {
  FixedPriceFormInputs,
  FixedPricingModelPayload,
} from "../../my-gigs.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { createFixedPriceValidationSchema } from "@/lib/validations/pricing/create-fixed-price-validation";
import useSWRMutation from "swr/mutation";
import { useParams } from "next/navigation";
import SnackBar from "@/app/components/snack-bar";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import useSWR from "swr";
import { IPricing } from "@/app/types";

async function fetchPrice(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { pricingModel: IPricing };
}

async function createPricingModel(
  url: string,
  { arg }: { arg: FixedPricingModelPayload }
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

const FixedPriceForm = () => {
  const params = useParams();

  const { snackbarToggle } = useContext(SnackbarContext);

  const { register, handleSubmit, reset } = useForm<FixedPriceFormInputs>({
    defaultValues: { price: 0 },
    resolver: yupResolver(createFixedPriceValidationSchema),
  });

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
    if (pricingModel) {
      reset({
        price: pricingModel.pricingModel.fixed_rate?.price,
      });
    }
  }, [pricingModel, reset]);

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

  const submitHandler = (values: FixedPriceFormInputs) =>
    createPricing({ type: "FIXED", fixed: { ...values } });

  return (
    <>
      <SnackBar />
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <FormControl required fullWidth size="small">
              <InputLabel htmlFor="price">Price</InputLabel>
              <OutlinedInput
                fullWidth
                size="small"
                label="Price"
                id="price"
                endAdornment={
                  <InputAdornment position="end">Rs</InputAdornment>
                }
                {...register("price")}
              />
            </FormControl>{" "}
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
          <Button variant="outlined" size="small">
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={isMutating}
          >
            {!isMutating && "Submit"}
            {isMutating && "Please wait..."}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default FixedPriceForm;
