"use client";
import React, { useContext, useEffect } from "react";
import AppBar from "@/app/components/app-bar";
import { Container, Grid2, SelectChangeEvent, Tab } from "@mui/material";
import { useForm } from "react-hook-form";
import GigPreview from "../components/gig-preview";
import GigForm from "../components/gig-form";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { GIG_PREVIEW, TABS } from "../constants";
import { GigFormInputs, GigPostRequestPayload } from "../my-gigs.types";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EventType } from "@prisma/client";
import SnackBar from "@/app/components/snack-bar";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { ICategories } from "@/app/types";
import AuthGuard from "@/app/guards/auth-guard";

async function createGigAsync(
  url: string,
  token: string,
  { arg }: { arg: GigPostRequestPayload }
) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
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

async function fetchCategories(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as ICategories;
}

const CreateGigPage = () => {
  const { snackbarToggle } = useContext(SnackbarContext);
  const { account, token } = useContext(AuthContext);

  const router = useRouter();

  const { register, setValue, watch, handleSubmit, reset } =
    useForm<GigFormInputs>({
      defaultValues: {
        title: "",
        description: "",
        location: "",
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
    trigger: createGig,
  } = useSWRMutation(
    "/api/gigs",
    (url: string, { arg }: { arg: GigPostRequestPayload }) =>
      createGigAsync(url, token as string, { arg: arg })
  );

  const { data: eventTypes = [] } = useSWR("/api/event-types", fetchEventTypes);

  const { data: categories = { count: 0, items: [] } } = useSWR(
    "/api/categories",
    fetchCategories
  );

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
        message: "Gig created successfully",
        severity: "success",
      });
      router.replace(`/vendor/gigs/${data.id}`);
    }
  }, [data, router, snackbarToggle]);

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
    createGig({ ...values, vendor_id: account?.user.vendors?.id ?? "" });

  return (
    <AuthGuard userType="VENDOR">
      <SnackBar />
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <TabContext value={"basic"}>
          <TabList>
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                {...tab}
                sx={{ textTransform: "none", fontWeight: 600 }}
                disabled={tab.value === "pricing"}
              />
            ))}
          </TabList>
          <TabPanel value="basic" sx={{ pl: 0, pr: 0 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 7 }}>
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
                  cardHeight="300px"
                />
              </Grid2>
            </Grid2>
          </TabPanel>
        </TabContext>
      </Container>
    </AuthGuard>
  );
};

export default CreateGigPage;
