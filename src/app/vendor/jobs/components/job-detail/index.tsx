import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import EventDetail from "./event-detail";
import { IVendorJob, JobDetailProps } from "../../jobs.types";
import useSWR from "swr";
import GigDetail from "./gig-detail";

type ITab = "event" | "gig";

async function fetchJob(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IVendorJob;
}

const JobDetail: React.FC<JobDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState<ITab>("event");

  const { data: job } = useSWR(id && `/api/jobs/${id}`, fetchJob);

  const tabChangeHandler = (event: React.SyntheticEvent, newValue: string) =>
    setActiveTab(newValue as ITab);

  return (
    <Box p="0.8rem">
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={tabChangeHandler}>
            <Tab
              label="Event Details"
              value={"event"}
              sx={{ textTransform: "none" }}
            />
            <Tab
              label="Gig Details"
              value={"gig"}
              sx={{ textTransform: "none" }}
            />
          </TabList>
        </Box>
        <TabPanel value="event">
          {job && <EventDetail {...job?.event} />}
        </TabPanel>
        <TabPanel value="gig">
          {job && (
            <GigDetail
              {...job?.gig}
              pricingTier={job?.pricingTier}
              pricingModel={job?.priceModel}
            />
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default JobDetail;
