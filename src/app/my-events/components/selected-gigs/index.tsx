"use client";
import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, List } from "@mui/material";
import NoData from "@/app/components/no-data";
import SelectedItem from "./selected-item";
import Dialog from "@/app/components/dialog";

import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";

import { useParams } from "next/navigation";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import useDialog from "@/app/hooks/use-dialog";

import { IJob } from "@/app/types";
import { DIALOG_INFO_TYPE } from "@/app/constants";
// import { SelectedGigsProps } from "./selected-gigs.types";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import RateJob from "../rate-job";
import { Gig } from "@prisma/client";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { RatingFormValues } from "../../events.type";

async function fetchJobs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IJob[];
}

async function deleteJob(url: string, { arg }: { arg: { id: string } }) {
  const response = await fetch(`${url}/${arg.id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return response.json();
}

async function createUserRating(
  url: string,
  token: string,
  { arg }: { arg: { rating: number; feedback: string } }
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

  return response.json();
}

const SelectedGigs: React.FC = () => {
  const params = useParams();

  const { snackbarToggle } = useContext(SnackbarContext);
  const { token } = useContext(AuthContext);

  const [userRating, setUserRating] = useState<RatingFormValues>({
    feedback: "",
    rating: 0,
  });

  const { data: jobs = [] } = useSWR(
    `/api/events/${params.id}/jobs`,
    fetchJobs
  );

  const {
    trigger: deleteJobTrigger,
    isMutating: isDeleting,
    data: deleteSuccess,
    error: deleteError,
    reset,
  } = useSWRMutation(`/api/events/${params.id}/jobs`, deleteJob);

  const { open, info, clickCloseHandler, clickOpenHandler } = useDialog();

  const { trigger: rateGig, isMutating } = useSWRMutation(
    info ? `/api/gigs/${info?.data.id}/ratings` : null,
    (url: string, { arg }: { arg: { rating: number; feedback: string } }) =>
      createUserRating(url, token as string, { arg }),
    {
      onSuccess: () => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Rate added successfully",
          severity: "success",
        });
        clickCloseHandler();
        setUserRating({ feedback: "", rating: 0 });
      },

      onError: (err) => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: err.message,
          severity: "error",
        });
      },
    }
  );

  useEffect(() => {
    if (isDeleting) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait..",
        severity: "info",
      });
    }
  }, [isDeleting, snackbarToggle]);

  useEffect(() => {
    if (deleteSuccess) {
      clickCloseHandler();
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Vendor removed successfully",
        severity: "success",
      });
      reset();
    }
  }, [clickCloseHandler, deleteSuccess, reset, snackbarToggle]);

  useEffect(() => {
    if (deleteError) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: deleteError.message,
        severity: "error",
      });
    }
  }, [deleteError, snackbarToggle]);

  useEffect(() => {
    if (isMutating) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isMutating, snackbarToggle]);

  const isUserRatingEmpty =
    userRating.feedback === "" || userRating.rating === 0;

  const deleteJobHandler = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    clickOpenHandler({ type: DIALOG_INFO_TYPE.DELETE_JOB, data: { id } });
  };

  const deleteJobConfirmHandler = () => {
    deleteJobTrigger({ id: info?.data.id ?? "" });
    clickCloseHandler();
  };

  const clickSelectedGigHandler = (gig: Gig) =>
    clickOpenHandler({ type: DIALOG_INFO_TYPE.JOB_COMPLETE, data: { ...gig } });

  const submitRating = () => rateGig({ ...userRating });

  const feedbackChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setUserRating({ ...userRating, [event.target.name]: event.target.value });

  const ratingHandler = (event: React.SyntheticEvent, value: number | null) =>
    setUserRating({ ...userRating, rating: value ?? 0 });

  return (
    <>
      <Card variant="outlined" sx={{ mt: 6 }}>
        <CardHeader title="Selected Vendors" />
        <CardContent>
          {jobs.length === 0 && <NoData />}
          <List>
            {jobs.map(({ id, gig, status }) => (
              <SelectedItem
                key={id}
                id={id}
                title={gig.title}
                name={gig.vendor.user.name}
                status={status}
                gig={gig}
                onDelete={deleteJobHandler}
                onClick={clickSelectedGigHandler}
              />
            ))}
          </List>
        </CardContent>
      </Card>

      {info?.type === DIALOG_INFO_TYPE.DELETE_JOB && (
        <Dialog
          title="Delete Job"
          content="Are you sure you want to delete this job?"
          open={open}
          maxWidth="xs"
          confirmButtonLabel="Delete"
          onClose={clickCloseHandler}
          onConfirm={deleteJobConfirmHandler}
        />
      )}
      {info?.type === DIALOG_INFO_TYPE.JOB_COMPLETE && (
        <Dialog
          title={`Rate ${info.data.title}`}
          open={open}
          maxWidth="xs"
          content={
            <RateJob
              values={userRating}
              onFeedbackChange={feedbackChangeHandler}
              onRateChange={ratingHandler}
            />
          }
          disableSubmitButton={isUserRatingEmpty}
          confirmButtonLabel="Submit"
          onClose={clickCloseHandler}
          onConfirm={submitRating}
        />
      )}
    </>
  );
};

export default SelectedGigs;
