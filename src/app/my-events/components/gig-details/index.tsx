import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import BasicDetails from "./basic-details";
import PricingDetails from "./pricing-details";
import { GigDetailsProps } from "../../events.type";
import useSWR from "swr";
import { IGig } from "@/app/types";

async function fetchGigById(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IGig;
}

const GigDetails: React.FC<GigDetailsProps> = ({
  id,
  selectedTierId,
  budget,
  onTierSelect,
}) => {
  const [activeTab, setActiveTab] = useState("basic");

  const { data: gig } = useSWR(id ? `/api/gigs/${id}` : null, fetchGigById);

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
        <PricingDetails
          id={id}
          budget={budget}
          selectedTierId={selectedTierId}
          onTierSelect={onTierSelect}
        />
      </TabPanel>
    </TabContext>
  );
};

export default GigDetails;
