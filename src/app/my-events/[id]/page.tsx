"use client";
import React, { useContext, useEffect, useState } from "react";
import AppBar from "@/app/components/app-bar";
import {
  Box,
  Grid2 as Grid,
  SelectChangeEvent,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { EventFormInputs, EventTab, JobFormProps } from "../events.type";
import { TABS } from "../constants";
import EventForm from "../components/event-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { eventValidationSchema } from "@/lib/validations/events/validation-schema";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import SnackBar from "@/app/components/snack-bar";
import useSWR from "swr";
import { useParams } from "next/navigation";
import GigList from "../components/gig-list";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import SelectedVendors from "../components/selected-gigs";
import Dialog from "@/app/components/dialog";
import GigDetails from "../components/gig-details";
import useDialog from "@/app/hooks/use-dialog";
import { DIALOG_INFO_TYPE } from "@/app/constants";

async function updateEventAsync(
  url: string,
  { arg }: { arg: EventFormInputs }
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

async function fetchEventById(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

async function createJobAsync(url: string, { arg }: { arg: JobFormProps }) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return await response.json();
}

const EventDetailPage = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("xl"));

  const { snackbarToggle } = useContext(SnackbarContext);
  const { account } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState<EventTab>("event");
  const [selectedGigId, setSelectedGigId] = useState<string | undefined>();
  const [selectedTierId, setSelectedTierId] = useState<string>("");

  const params = useParams();

  const activeTabChangeHandler = (
    event: React.SyntheticEvent,
    newValue: string
  ) => setActiveTab(newValue as EventTab);

  const {
    formState: { errors },
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm<EventFormInputs>({
    defaultValues: {
      title: " ",
      date_time: null,
      duration: " ",
      event_type_id: undefined,
      venue: " ",
      organizer_id: account?.user.organizers?.id,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(eventValidationSchema) as any,
  });

  const {
    isMutating,
    data,
    error,
    trigger: updateEvent,
  } = useSWRMutation(
    `/api/organizers/${account?.user.organizers?.id}/events/${params.id}`,
    updateEventAsync
  );

  const {
    isMutating: isCreating,
    data: jobCreatedResponse,
    error: jobCreateError,
    trigger: createJob,
    reset: jobCreateReset,
  } = useSWRMutation(`/api/events/${params.id}/jobs`, createJobAsync);

  const { open, info, clickCloseHandler, clickOpenHandler } = useDialog();

  const { data: event } = useSWR(`/api/events/${params.id}`, fetchEventById);

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        venue: event.venue,
        duration: event.duration,
        date_time: dayjs(event.date_time),
        event_type_id: event.event_type.id,
        organizer_id: account?.user.organizers?.id,
      });
    }
  }, [account, event, reset]);

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
        message: "Event created successfully",
        severity: "success",
      });
    }
  }, [data, snackbarToggle]);

  useEffect(() => {
    if (isCreating) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait..",
        severity: "info",
      });
    }
  }, [isCreating, snackbarToggle]);

  useEffect(() => {
    if (jobCreatedResponse) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Vendor selected successfully",
        severity: "success",
      });
      clickCloseHandler();
      jobCreateReset();
    }
  }, [jobCreatedResponse, jobCreateReset, clickCloseHandler, snackbarToggle]);

  useEffect(() => {
    if (jobCreateError) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: jobCreateError.message,
        severity: "error",
      });
    }
  }, [jobCreateError, snackbarToggle]);

  const watchDateTime = watch("date_time");
  const watchEventTypeId = watch("event_type_id");

  const dateChangeHandler = (value: Dayjs | null) => {
    setValue("date_time", value);
  };

  const eventTypeChangeHandler = (event: SelectChangeEvent) =>
    setValue("event_type_id", event.target.value);

  const submitHandler = (values: EventFormInputs) => updateEvent(values);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectGigClickHandler = (id: string, _event: React.MouseEvent) => {
    setSelectedGigId(id);
    clickOpenHandler({ type: DIALOG_INFO_TYPE.DETAILS_GIG });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tierSelectHandler = (id: string, event: React.MouseEvent) =>
    setSelectedTierId(id);

  const addGigHandler = () => {
    createJob({
      event_id: String(params.id),
      gig_id: selectedGigId ?? "0",
      ...(selectedTierId && { pricing_tier_id: selectedTierId }),
    });
  };

  return (
    <>
      <SnackBar />
      <AppBar />
      <Grid container spacing={1} mt={8.5} pl={2} pr={2}>
        <Grid size={{ xs: 12, md: activeTab === "vendor" ? 7 : 6, xl: 6 }}>
          <TabContext value={activeTab}>
            <TabList onChange={activeTabChangeHandler}>
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  {...tab}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                />
              ))}
            </TabList>
            <TabPanel value="event" sx={{ pl: 0 }}>
              <EventForm
                errors={errors}
                dateTime={watchDateTime}
                isMutating={isMutating}
                eventTypeId={`${watchEventTypeId}`}
                submitBtnLabel="Update"
                register={register}
                handleSubmit={handleSubmit}
                submitHandler={submitHandler}
                onDateChange={dateChangeHandler}
                reset={reset}
                onEventTypeChange={eventTypeChangeHandler}
              />
            </TabPanel>
            <TabPanel value="vendor" sx={{ pl: 0 }}>
              <GigList
                onAddClick={addGigHandler}
                eventType={event?.event_type.name}
                onClick={selectGigClickHandler}
              />
            </TabPanel>
          </TabContext>
        </Grid>
        <Grid size={{ xs: 12, md: activeTab === "vendor" ? 5 : 6, xl: 6 }}>
          {activeTab !== "vendor" && (
            <Box
              component="div"
              sx={{ width: "100%", height: "100%", position: "fixed" }}
            >
              <Image
                src="/images/undraw_party_27wv.svg"
                alt="undraw"
                height={isLarge ? 700 : 500}
                width={isLarge ? 800 : 600}
                quality={90}
              />
            </Box>
          )}
          {activeTab === "vendor" && <SelectedVendors />}
        </Grid>
      </Grid>

      {info?.type === DIALOG_INFO_TYPE.DETAILS_GIG && (
        <Dialog
          title="Gig Details"
          content={
            <GigDetails
              id={selectedGigId}
              selectedTierId={selectedTierId}
              onTierSelect={tierSelectHandler}
            />
          }
          open={open}
          confirmButtonLabel="Add"
          onClose={clickCloseHandler}
          onConfirm={addGigHandler}
        />
      )}
    </>
  );
};

export default EventDetailPage;
