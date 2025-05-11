"use client";
import React, { useEffect, useState } from "react";
import { CheckoutProps } from "../payment.types";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import convertToSubCurrency from "@/lib/utils/convert-to-sub-currency";
import { Box, Button, Typography } from "@mui/material";

const Checkout: React.FC<CheckoutProps> = ({ jobId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubCurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?jobId=${jobId}&amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return <div>Loading...</div>;
  }

  return (
    <Box component="form" onSubmit={submitHandler}>
      {clientSecret && <PaymentElement />}
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={!stripe || isLoading}
      >
        {!isLoading ? `Pay ${amount}` : "Processing..."}
      </Button>
    </Box>
  );
};

export default Checkout;
