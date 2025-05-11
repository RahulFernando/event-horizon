"use client";
import { useEffect, useState } from "react";
import AppBar from "@/app/components/app-bar";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
} from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWRMutation from "swr/mutation";

async function createPayment(
  url: string,
  { arg }: { arg: { amount: number } }
) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const amount = searchParams.get("amount");
  const jobId = searchParams.get("jobId");

  const { trigger: makePayment } = useSWRMutation(
    `/api/jobs/${jobId}/payments`,
    createPayment,
    {
      onSuccess: () => {
        setIsLoading(false);
      },
    }
  );

  useEffect(() => {
    if (amount && jobId) {
      setIsLoading(true);
      makePayment({ amount: +amount });
    }
  }, [amount, jobId, makePayment]);

  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 12 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card sx={{ width: "50%", padding: 2 }}>
            <CardHeader
              // eslint-disable-next-line @next/next/no-img-element
              avatar={<img src="/icons/card-payment.png" alt="Success" />}
              title="Payment Successful"
              subheader={`Your payment of Rs${amount} was successful!`}
              slotProps={{
                title: {
                  sx: {
                    textAlign: "center",
                    color: "primary.main",
                    fontSize: "2rem",
                  },
                },
                subheader: {
                  sx: {
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: "1.25rem",
                  },
                },
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
              }}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  sx={{ width: "30%" }}
                  LinkComponent={Link}
                  href="/"
                  disabled={isLoading}
                >
                  Go to Home
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default PaymentSuccessPage;
