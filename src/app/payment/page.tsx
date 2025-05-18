"use client";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Container } from "@mui/material";
import convertToSubCurrency from "@/lib/utils/convert-to-sub-currency";
import Checkout from "./components/checkout";
import AppBar from "../components/app-bar";
import { useSearchParams } from "next/navigation";
import AuthGuard from "../guards/auth-guard";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const amount = Number(searchParams.get("amount") ?? 0);
  const jobId = searchParams.get("jobId");

  return (
    <AuthGuard userType="ORGANIZER">
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubCurrency(amount),
            currency: "usd",
          }}
        >
          <Checkout jobId={jobId ?? ""} amount={amount} />
        </Elements>
      </Container>
    </AuthGuard>
  );
};

export default PaymentPage;
