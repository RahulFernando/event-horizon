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
import { EventFormInputs, EventTab } from "../events.type";
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

const EventDetailPage = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("xl"));

  const { snackbarToggle } = useContext(SnackbarContext);

  const [activeTab, setActiveTab] = useState<EventTab>("vendor");

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
      organizer_id: "20c2af7c-225e-4177-85b2-5bbb69ac0563",
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
    `/api/organizers/20c2af7c-225e-4177-85b2-5bbb69ac0563/events/${params.id}`,
    updateEventAsync
  );

  const { data: event } = useSWR(`/api/events/${params.id}`, fetchEventById);

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        venue: event.venue,
        duration: event.duration,
        date_time: dayjs(event.date_time),
        event_type_id: event.event_type.id,
        organizer_id: "20c2af7c-225e-4177-85b2-5bbb69ac0563",
      });
    }
  }, [event, reset]);

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

  const watchDateTime = watch("date_time");
  const watchEventTypeId = watch("event_type_id");

  const dateChangeHandler = (value: Dayjs | null) => {
    setValue("date_time", value);
  };

  const eventTypeChangeHandler = (event: SelectChangeEvent) =>
    setValue("event_type_id", event.target.value);

  const submitHandler = (values: EventFormInputs) => updateEvent(values);

  return (
    <>
      <SnackBar />
      <AppBar />
      <Grid container spacing={1} mt={8.5} pl={2} pr={2}>
        <Grid size={{ xs: 12, md: 6, xl: 6 }}>
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
              <GigList eventType={event?.event_type.name} />
            </TabPanel>
          </TabContext>
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 6 }}>
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
        </Grid>
      </Grid>
    </>
  );
};

export default EventDetailPage;
