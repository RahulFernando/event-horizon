import React, { useEffect, useState } from "react";
import {
  Grid2,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { PaymentProps, PaymentType } from "../events.type";
import useSWR from "swr";
import { IJobInvoice } from "@/app/types";

async function fetchPayments(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IJobInvoice;
}

const Payment: React.FC<PaymentProps> = ({ jobId, amount, setAmount }) => {
  const [paymentType, setPaymentType] = useState<PaymentType>("FULL");

  const { data: invoice } = useSWR(
    `/api/jobs/${jobId}/payments`,
    fetchPayments
  );

  const advanceDisable = invoice && invoice.payments.length > 0;

  useEffect(() => {
    if (invoice) {
      const paidAmount = invoice.payments.reduce((a, b) => a + b.amount, 0);
      const _amount =
        paymentType === "FULL"
          ? invoice.total_amount - paidAmount
          : invoice.total_amount * 0.1;
      setAmount(_amount);
    }
  }, [invoice, paymentType, setAmount]);

  const toggleChangeHandler = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (!newAlignment) return;
    setPaymentType(newAlignment as PaymentType);
  };

  return (
    <Grid2 container spacing={2} mt={1}>
      <Grid2 size={{ xs: 6 }}>
        <TextField
          value={amount}
          fullWidth
          label="Amount"
          size="small"
          slotProps={{
            htmlInput: {
              readOnly: true,
            },
          }}
        />
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <ToggleButtonGroup
          size="small"
          value={paymentType}
          exclusive
          onChange={toggleChangeHandler}
          aria-label="text alignment"
        >
          <ToggleButton value="FULL" aria-label="left aligned">
            Full
          </ToggleButton>
          <ToggleButton
            value="ADVANCE"
            aria-label="centered"
            disabled={advanceDisable}
          >
            Advance
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid2>
    </Grid2>
  );
};

export default Payment;
