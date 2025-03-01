"use client";
import React, { useState, useEffect, useContext } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Badge, Tooltip } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { ICalendar } from "@/app/types";
import useSWR from "swr";
import { AuthContext } from "@/app/contexts/auth/auth-context";

interface MarkedDate {
  date: string;
  title: string;
}

async function fetchCalendar(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as ICalendar[];
}

const Calendar = () => {
  const { account } = useContext(AuthContext);

  const [markedDates, setMarkedDates] = useState<MarkedDate[]>([]);

  const { isLoading, data: calendar = [] } = useSWR(
    `/api/vendors/${account?.user?.vendors?.id}/calendars`,
    fetchCalendar
  );

  useEffect(() => {
    if (calendar.length) {
      const dates = calendar.map((record) => ({
        title: record.job.event.title,
        date: record.date_time,
      }));
      setMarkedDates(dates);
    }
  }, [calendar]);

  const ServerDay = (props: PickersDayProps<Date>) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const markedDate = markedDates.find(
      (markedDate) =>
        new Date(markedDate.date).setHours(0, 0, 0, 0) ===
        new Date(day).setHours(0, 0, 0, 0)
    );

    if (markedDate && !outsideCurrentMonth) {
      return (
        <Tooltip title={markedDate.title} placement="top" arrow>
          <Badge
            key={day.toString()}
            overlap="circular"
            badgeContent="•"
            color="primary"
          >
            <PickersDay
              day={day}
              outsideCurrentMonth={outsideCurrentMonth}
              {...other}
            />
          </Badge>
        </Tooltip>
      );
    }

    return (
      <PickersDay
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        {...other}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar
        slots={{
          day: ServerDay,
        }}
        loading={isLoading}
      />
    </LocalizationProvider>
  );
};

export default Calendar;
