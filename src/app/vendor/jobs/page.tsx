"use client";
import AppBar from "@/app/components/app-bar";
import { Box, Container, Stack } from "@mui/material";
import Navigation from "../dashboard/components/navigation";
import ProgressSection from "./components/progress/progress-section";
import JobList from "./components/job-list";
import Dialog from "@/app/components/dialog";
import useDialog from "@/app/hooks/use-dialog";
import EventDetail from "./components/job-detail";
import DialogFooter from "./components/dialog-footer";
import { JobStatus } from "@prisma/client";
import useSWRMutation from "swr/mutation";
import { useContext } from "react";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { IVendorJob } from "./jobs.types";
import useSWR from "swr";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import SnackBar from "@/app/components/snack-bar";

async function fetchJobs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IVendorJob[];
}

async function updateStatus(
  url: string,
  { arg }: { arg: { status: JobStatus } }
) {
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

const VendorJobsPage = () => {
  const { account } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const { open, info, clickCloseHandler, clickOpenHandler } = useDialog();

  const { data: jobs = [], mutate: refetchJobs } = useSWR(
    account?.user?.vendors?.id &&
      `/api/vendors/${account?.user?.vendors?.id}/jobs`,
    fetchJobs
  );

  const { isMutating, trigger: updateJobStatus } = useSWRMutation(
    account?.user.vendors?.id &&
      `/api/vendors/${account?.user.vendors?.id}/jobs/${info?.data.id}`,
    updateStatus,
    {
      onSuccess: () => {
        refetchJobs();
        clickCloseHandler();
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Status change successfully",
          severity: "success",
        });
      },
    }
  );

  const jobClickHandler = (id: string) => {
    clickOpenHandler({ data: { id } });
  };

  const changeStatusHandler = (value: JobStatus) =>
    updateJobStatus({ status: value });

  return (
    <>
      <SnackBar />
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Navigation />
          <Box sx={{ flexGrow: 1 }}>
            <ProgressSection />
            <Box sx={{ mt: 2 }}>
              <JobList jobs={jobs} onClick={jobClickHandler} />
            </Box>
          </Box>
        </Stack>
      </Container>

      <Dialog
        open={open}
        title="Job Details"
        content={<EventDetail id={info?.data.id} />}
        footer={
          <DialogFooter
            isLoading={isMutating}
            onClose={clickCloseHandler}
            onSubmit={changeStatusHandler}
          />
        }
        confirmButtonLabel="Submit"
        onClose={clickCloseHandler}
        onConfirm={() => {}}
      />
    </>
  );
};

export default VendorJobsPage;
