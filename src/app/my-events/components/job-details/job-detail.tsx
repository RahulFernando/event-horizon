"use client";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import BasicDetails from "../gig-details/basic-details";
import { IGig, IJob } from "@/app/types";
import PricingDetail from "./pricing-detail";

async function fetchGigById(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IGig;
}

async function fetchJobById(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IJob;
}

const JobDetail = ({ id, jobId }: { id: number; jobId: number }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const { data: gig } = useSWR(id ? `/api/gigs/${id}` : null, fetchGigById);
  const { data: job } = useSWR(id ? `/api/jobs/${jobId}` : null, fetchJobById);

  const tabChangeHandler = (event: React.SyntheticEvent, value: string) =>
    setActiveTab(value);

  return (
    <TabContext value={activeTab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={tabChangeHandler}>
          <Tab
            label="Basic Info"
            value={"basic"}
            sx={{ textTransform: "none" }}
          />
          <Tab
            label="Pricing Info"
            value={"pricing"}
            sx={{ textTransform: "none" }}
          />
        </TabList>
      </Box>
      <TabPanel value={"basic"}>
        <BasicDetails {...gig} />
      </TabPanel>
      <TabPanel value={"pricing"}>
        <PricingDetail job={job} />
      </TabPanel>
    </TabContext>
  );
};

export default JobDetail;
