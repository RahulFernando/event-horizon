import React from "react";
import { Container, Grid2, Stack, Typography } from "@mui/material";
import FAQItem from "./faq-item";

const faqs = [
  {
    summary: "How do I create an event as an organizer?",
    description:
      "To create an event, sign in to your account, go to the Create Event section, and fill in the required details such as name, date, location, and description before submitting the form.",
  },
  {
    summary: "How do I select vendors or service providers for my event?",
    description:
      "You can select vendors or service providers by visiting your event details page, browsing the available options, and inviting those who meet your specific requirements.",
  },
  {
    summary:
      "Can I chat with vendors/service providers before confirming them for my event?",
    description:
      "Yes, you can chat with vendors after inviting them by accessing the Chat section in your dashboard and starting a conversation to discuss your event requirements.",
  },
  {
    summary: "How do I make payments through the website?",
    description:
      "To make a payment, go to the Payments section of your event, select the vendor or service, and complete the transaction securely using our integrated payment gateway.",
  },
  {
    summary: "What if I need to cancel or modify my event?",
    description:
      "If you need to cancel or modify your event, visit the Event Management section, select your event, make the necessary changes or cancel it, and system will notify vendors accordingly.",
  },
];

const FAQSection = () => (
  <Container maxWidth={false}>
    <Stack
      direction="row"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography variant="h3" fontWeight={600}>
        FAQs
      </Typography>
    </Stack>
    <Grid2 container spacing={2} mb={4}>
      {faqs.map((faq) => (
        <Grid2 key={faq.summary} size={{ xs: 12 }}>
          <FAQItem {...faq} />
        </Grid2>
      ))}
    </Grid2>
  </Container>
);

export default FAQSection;
