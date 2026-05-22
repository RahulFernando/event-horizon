import { IInvoice, IJob } from "@/app/types";
import { Box, Chip, Divider, Typography } from "@mui/material";
import React from "react";
import useSWR from "swr";

interface PricingDetailProps {
  job?: IJob;
}

interface PricingRowProps {
  label: string;
  value: React.ReactNode;
}

async function fetchInvoiceByJobId(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IInvoice;
}

const PricingRow: React.FC<PricingRowProps> = ({ label, value }) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    py={0.75}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600} color="text.primary">
      {value}
    </Typography>
  </Box>
);

const PricingDetail: React.FC<PricingDetailProps> = ({ job }) => {
  const { data: invoice } = useSWR(
    job ? `/api/jobs/${job.id}/payments` : null,
    fetchInvoiceByJobId,
  );

  const { gig, pricingTier } = job || {};
  const { pricing_mode } = gig || {};

  const { payments } = invoice || {};
  const totalPaid =
    payments?.reduce((acc, payment) => acc + payment.amount, 0) ?? 0;

  const renderPricingDetails = () => {
    if (pricing_mode?.fixed_rate) {
      const remainingBalance = pricing_mode.fixed_rate.price - totalPaid;

      return (
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <Typography variant="subtitle2" fontWeight={700}>
              Pricing Details
            </Typography>
            <Chip
              label="Fixed Rate"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Divider sx={{ mb: 1 }} />
          <PricingRow
            label="Price"
            value={pricing_mode.fixed_rate?.price.toLocaleString()}
          />
          <PricingRow
            label="Remaining Balance"
            value={
              <Typography variant="body2" fontWeight={700} color="warning.main">
                {remainingBalance.toLocaleString()}
              </Typography>
            }
          />
        </Box>
      );
    }

    if (pricing_mode?.hourly_rate) {
      const total = pricing_mode.hourly_rate.price * (job?.duration ?? 1);
      const remainingBalance = total - totalPaid;

      return (
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <Typography variant="subtitle2" fontWeight={700}>
              Pricing Details
            </Typography>
            <Chip
              label="Hourly Rate"
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>
          <Divider sx={{ mb: 1 }} />
          <PricingRow
            label="Duration"
            value={`${job?.duration} ${job?.duration === 1 ? "hour" : "hours"}`}
          />
          <PricingRow
            label="Hourly Price"
            value={`${pricing_mode.hourly_rate.price.toLocaleString()}/hr`}
          />
          <Divider sx={{ my: 1 }} />
          <PricingRow
            label="Total"
            value={
              <Typography variant="body2" fontWeight={700} color="success.main">
                {total.toLocaleString()}
              </Typography>
            }
          />
          <PricingRow
            label="Remaining Balance"
            value={
              <Typography variant="body2" fontWeight={700} color="warning.main">
                {remainingBalance.toLocaleString()}
              </Typography>
            }
          />
        </Box>
      );
    }

    if (pricingTier) {
      const remainingBalance = pricingTier.price - totalPaid;

      return (
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <Typography variant="subtitle2" fontWeight={700}>
              Pricing Details
            </Typography>
            <Chip
              label="Tiered"
              size="small"
              color="warning"
              variant="outlined"
            />
          </Box>
          <Divider sx={{ mb: 1 }} />
          <PricingRow label="Tier" value={pricingTier.level} />
          <PricingRow
            label="Price"
            value={pricingTier.price.toLocaleString()}
          />
          <PricingRow
            label="Remaining Balance"
            value={
              <Typography variant="body2" fontWeight={700} color="warning.main">
                {remainingBalance.toLocaleString()}
              </Typography>
            }
          />
          {pricingTier.description && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                fontStyle="italic"
              >
                {pricingTier.description}
              </Typography>
            </>
          )}
        </Box>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary" fontStyle="italic">
        No pricing information available.
      </Typography>
    );
  };

  return <Box p={1}>{renderPricingDetails()}</Box>;
};

export default PricingDetail;
