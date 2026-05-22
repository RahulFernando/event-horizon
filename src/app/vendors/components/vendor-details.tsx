"use client";
import { IGig, IVendor } from "@/app/types";
import { Box } from "@mui/material";
import React from "react";
import useSWR from "swr";

async function fetchVendorDetails(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IVendor;
}

async function fetchGigs(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { count: number; items: IGig[] };
}

const VendorDetails = ({ id }: { id: number }) => {
  const { data: vendor } = useSWR(`/api/vendors/${id}`, fetchVendorDetails);
  const { data: gigs } = useSWR(`/api/vendors/${id}/gigs`, fetchGigs);

  return (
    <Box p={0.5}>
      <Box component="h2" fontSize={24} fontWeight={600} mb={2}>
        {vendor?.user.name}
      </Box>
      <Box component="p" fontSize={16} mb={1}>
        <strong>Business Registration:</strong>{" "}
        {vendor?.business_registration ?? "N/A"}
      </Box>
      <Box component="p" fontSize={16} mb={1}>
        <strong>Taxpayer Identification Number:</strong>{" "}
        {vendor?.taxpayer_identification_number ?? "N/A"}
      </Box>

      <Box component="h3" fontSize={20} fontWeight={600} mt={3} mb={2}>
        Gigs
      </Box>

      {gigs?.items.length ? (
        gigs.items.map((gig) => (
          <Box
            key={gig.id}
            mb={2}
            p={1}
            border="1px solid #ccc"
            borderRadius={2}
          >
            <Box component="h4" fontSize={18} fontWeight={500}>
              {gig.title}
            </Box>
            <Box component="p" fontSize={14}>
              {gig.description}
            </Box>
          </Box>
        ))
      ) : (
        <Box component="p" fontSize={16}>
          No gigs available.
        </Box>
      )}
    </Box>
  );
};

export default VendorDetails;
