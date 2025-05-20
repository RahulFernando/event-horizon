"use client";
import React, { useContext, useEffect, useState } from "react";
import AppBar from "@/app/components/app-bar";
import { Container, Grid2, SelectChangeEvent, Tab } from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "next/navigation";
import GigPreview from "../components/gig-preview";
import GigForm from "../components/gig-form";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { GIG_PREVIEW, TABS } from "../constants";
import { GigFormInputs, GigPostRequestPayload } from "../my-gigs.types";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import useSWR from "swr";
import { EventType, PricingModelType } from "@prisma/client";
import { ICategories, IGig, IPricing } from "@/app/types";
import SnackBar from "@/app/components/snack-bar";
import ModelSelector from "../components/pricing-models/pricing-model-selector";
import withPricingModel from "../components/hoc/with-pricing-model";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import AuthGuard from "@/app/guards/auth-guard";

async function updateGigAsync(
  url: string,
  { arg }: { arg: GigPostRequestPayload }
) {
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

async function fetchEventTypes(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as EventType[];
}

async function fetchGigById(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IGig;
}

async function fetchPricingModel(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IPricing;
}

async function fetchCategories(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as ICategories;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PricingComponent = withPricingModel(() => <div />);

const GigPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const tab = searchParams.get("activeTab");

  const { snackbarToggle } = useContext(SnackbarContext);
  const { account } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState(tab ?? "pricing");
  const [pricingModelType, setPricingModelType] = useState<
    PricingModelType | undefined
  >();

  const { register, setValue, watch, handleSubmit, reset } =
    useForm<GigFormInputs>({
      defaultValues: {
        title: " ",
        description: " ",
        location: " ",
        category_id: "",
        event_type_ids: [],
      },
    });

  const title = watch("title");
  const description = watch("description");
  const location = watch("location");
  const eventTypeIds = watch("event_type_ids");
  const categoryId = watch("category_id");

  const {
    isMutating,
    error,
    data,
    trigger: updateGig,
  } = useSWRMutation(`/api/gigs/${params.id}`, updateGigAsync);

  const { data: eventTypes = [] } = useSWR("/api/event-types", fetchEventTypes);

  const { data: gig } = useSWR(`/api/gigs/${params.id}`, fetchGigById);

  const { isLoading: isPricingModelLoading, data: pricingModel } = useSWR(
    `/api/gigs/${params.id}/pricings`,
    fetchPricingModel
  );

  const { data: categories = { count: 0, items: [] } } = useSWR(
    "/api/categories",
    fetchCategories
  );

  useEffect(() => {
    if (gig) {
      const eventTypes = gig.event_types.map((type) => type.event_type.id);
      reset({
        title: gig.title,
        description: gig.description ?? "",
        location: gig.location,
        category_id: gig.category.id,
        event_type_ids: eventTypes,
      });
    }
  }, [gig, reset]);

  useEffect(() => {
    if (pricingModel) {
      setPricingModelType(pricingModel.type);
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
        message: "Gig updated successfully",
        severity: "success",
      });
    }
  }, [data, snackbarToggle]);

  const selectedEventTypes = eventTypes
    .filter((type) => eventTypeIds.includes(type.id))
    .map((type) => type.name);

  const eventTypesChangeHandler = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setValue(
      "event_type_ids",
      typeof value === "string" ? value.split(",") : value
    );
  };

  const submitHandler = (values: GigFormInputs) =>
    updateGig({ ...values, vendor_id: account?.user.vendors?.id ?? "" });

  const activeTabChangeHandler = (
    event: React.SyntheticEvent,
    newValue: string
  ) => setActiveTab(newValue);

  const pricingModelTypeChangeHandler = (value: PricingModelType) =>
    setPricingModelType(value);

  return (
    <AuthGuard userType="VENDOR">
      <SnackBar />
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <TabContext value={activeTab}>
          <TabList onChange={activeTabChangeHandler}>
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                {...tab}
                sx={{ textTransform: "none", fontWeight: 600 }}
                disabled={tab.value === "vendor"}
              />
            ))}
          </TabList>
          <TabPanel value="basic" sx={{ pl: 0, pr: 0 }}>
            <Grid2 container spacing={2}>
              <Grid2 container size={{ xs: 12, md: 7 }}>
                <GigForm
                  eventTypes={eventTypes}
                  isMutating={isMutating}
                  eventTypeIds={eventTypeIds}
                  categories={categories.items}
                  categoryId={categoryId}
                  onEventTypesChange={eventTypesChangeHandler}
                  register={register}
                  handleSubmit={handleSubmit}
                  onSubmit={submitHandler}
                  reset={reset}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 5 }}>
                <GigPreview
                  title={title ? title : GIG_PREVIEW["title"]}
                  description={
                    description ? description : GIG_PREVIEW["description"]
                  }
                  location={location ? location : GIG_PREVIEW["location"]}
                  event_types={
                    selectedEventTypes.length > 0
                      ? selectedEventTypes
                      : GIG_PREVIEW["event_types"]
                  }
                />
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value="pricing" sx={{ pl: 0, pr: 0 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 7 }}>
                <Grid2 container spacing={1}>
                  <Grid2 size={{ xs: 12 }}>
                    <ModelSelector
                      isLoading={isPricingModelLoading}
                      pricingModel={pricingModelType}
                      onPricingModelChange={pricingModelTypeChangeHandler}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12 }} sx={{ mt: 3 }}>
                    <PricingComponent pricingModel={pricingModelType} />
                  </Grid2>
                </Grid2>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 5 }}>
                <GigPreview
                  title={title ? title : GIG_PREVIEW["title"]}
                  description={
                    description ? description : GIG_PREVIEW["description"]
                  }
                  location={location ? location : GIG_PREVIEW["location"]}
                  event_types={
                    selectedEventTypes.length > 0
                      ? selectedEventTypes
                      : GIG_PREVIEW["event_types"]
                  }
                />
              </Grid2>
            </Grid2>
          </TabPanel>
        </TabContext>
      </Container>
    </AuthGuard>
  );
};

export default GigPage;
