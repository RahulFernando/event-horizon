import LabelWithValue from "@/app/admin/events/components/label-with-value";
import { IInvoice } from "@/app/types";
import { Grid2 } from "@mui/material";
import React from "react";

interface PaymentDetailProps {
  invoice: IInvoice;
}

const PaymentDetail: React.FC<PaymentDetailProps> = ({ invoice }) => {
  const totalAmountPaid = invoice.payments.reduce((a, b) => a + b.amount, 0);
  const remainingAmountToBePaid = invoice.total_amount - totalAmountPaid;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 6 }}>
        <LabelWithValue label="Total Amount Paid" value={totalAmountPaid} />
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <LabelWithValue
          label="Remain to be Paid"
          value={
            remainingAmountToBePaid === 0 ? "----" : remainingAmountToBePaid
          }
        />
      </Grid2>
    </Grid2>
  );
};

export default PaymentDetail;
