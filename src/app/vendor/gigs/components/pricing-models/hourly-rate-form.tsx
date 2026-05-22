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
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useForm } from "react-hook-form";
import {
  HourlyRateFormInputs,
  HourlyRatePriceModelPayload,
  UpdateHourlyRatePriceModelPayload,
} from "../../my-gigs.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { hourlyPriceValidationSchema } from "@/lib/validations/pricing/hourly-price-validation";
import { IPricing } from "@/app/types";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { useParams } from "next/navigation";

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
  { arg }: { arg: HourlyRatePriceModelPayload }
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

async function updatePricingModel(
  url: string,
  { arg }: { arg: UpdateHourlyRatePriceModelPayload }
) {
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IPricing;
}

const HourlyRateForm = () => {
  const params = useParams();

  const { snackbarToggle } = useContext(SnackbarContext);

  const { register, handleSubmit, reset } = useForm<HourlyRateFormInputs>({
    defaultValues: { hour: "", price: 0 },
    resolver: yupResolver(hourlyPriceValidationSchema),
  });

  const { data: pricingModel } = useSWR(
    `/api/gigs/${params.id}/pricings`,
    fetchPrice
  );

  const pricingModelId = pricingModel?.pricingModel?.id;

  const {
    isMutating: isCreating,
    error: createError,
    data: createData,
    trigger: createPricing,
  } = useSWRMutation(`/api/gigs/${params.id}/pricings`, createPricingModel);

  const {
    isMutating: isUpdating,
    error: updateError,
    data: updateData,
    trigger: updatePricing,
  } = useSWRMutation(
    pricingModelId
      ? `/api/gigs/${params.id}/pricings/${pricingModelId}`
      : null,
    updatePricingModel
  );

  const isMutating = isCreating || isUpdating;

  useEffect(() => {
    if (pricingModel) {
      reset({
        hour: pricingModel.pricingModel.hourly_rate?.hour,
        price: pricingModel.pricingModel.hourly_rate?.price,
      });
    }
  }, [pricingModel, reset]);

  useEffect(() => {
    if (createError || updateError) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: (createError || updateError)!.message,
        severity: "error",
      });
    }
  }, [createError, updateError, snackbarToggle]);

  useEffect(() => {
    if (createData) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Pricing model created",
        severity: "success",
      });
    }
  }, [createData, snackbarToggle]);

  useEffect(() => {
    if (updateData) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Pricing model updated",
        severity: "success",
      });
    }
  }, [updateData, snackbarToggle]);

  const submitHandler = (values: HourlyRateFormInputs) => {
    if (pricingModelId) {
      updatePricing({ hourlyRate: { ...values } });
    } else {
      createPricing({ type: "HOURLY_RATE", hourlyRate: { ...values } });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 6 }}>
          <FormControl required fullWidth size="small">
            <InputLabel htmlFor="hour">Hour</InputLabel>
            <OutlinedInput
              fullWidth
              size="small"
              label="Hour"
              id="hour"
              endAdornment={<InputAdornment position="end">H</InputAdornment>}
              {...register("hour")}
            />
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <FormControl required fullWidth size="small">
            <InputLabel htmlFor="price">Price</InputLabel>
            <OutlinedInput
              fullWidth
              size="small"
              label="Price"
              id="price"
              endAdornment={<InputAdornment position="end">Rs</InputAdornment>}
              {...register("price")}
            />
          </FormControl>
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
  );
};

export default HourlyRateForm;
