import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import EventDetail from "./event-detail";
import { IVendorJob, JobDetailProps } from "../../jobs.types";
import useSWR from "swr";
import GigDetail from "./gig-detail";
import { IInvoice } from "@/app/types";
import PaymentDetail from "./payment-detail";

type ITab = "event" | "gig" | "payment";

async function fetchJob(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IVendorJob;
}

async function fetchInvoice(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IInvoice;
}

const JobDetail: React.FC<JobDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState<ITab>("event");

  const { data: job } = useSWR(id && `/api/jobs/${id}`, fetchJob);
  const { data: invoice } = useSWR(
    id && `/api/jobs/${id}/payments`,
    fetchInvoice
  );

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
            <Tab
              label="Payment Details"
              value={"payment"}
              sx={{ textTransform: "none" }}
              disabled={!invoice}
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
        <TabPanel value="payment">
          {invoice && <PaymentDetail invoice={invoice} />}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default JobDetail;
