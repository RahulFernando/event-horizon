"use client";
import React, { useContext, useEffect } from "react";
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
import { SelectedGigsProps } from "./selected-gigs.types";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";

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

const SelectedGigs: React.FC<SelectedGigsProps> = () => {
  const params = useParams();

  const { snackbarToggle } = useContext(SnackbarContext);

  const { data: jobs = [] } = useSWR(
    `/api/events/${params.id}/jobs`,
    fetchJobs
  );

  console.log(jobs);

  const {
    trigger: deleteJobTrigger,
    isMutating: isDeleting,
    data: deleteSuccess,
    error: deleteError,
    reset,
  } = useSWRMutation(`/api/events/${params.id}/jobs`, deleteJob);

  const { open, info, clickCloseHandler, clickOpenHandler } = useDialog();

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
                onDelete={deleteJobHandler}
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
    </>
  );
};

export default SelectedGigs;
