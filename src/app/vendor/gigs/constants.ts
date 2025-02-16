import { PricingModelType } from "@prisma/client";

export const TABS = [
  { value: "basic", label: "Basic Details" },
  { value: "pricing", label: "Pricing" },
];

export const EVENT_TYPES = [
  { id: "709bcddd-b598-4221-80e5-d79efc925be9", name: "Wedding" },
  { id: "3e09d041-f38c-4f50-823d-f6259a9d8324", name: "Corporate Gathering" },
];

export const GIG_PREVIEW = {
  title: "Gig Preview",
  description: "Gig preview description",
  location: "Gig preview location",
  event_types: ["Wedding", "Festival"],
};

export const PRICING_MODEL_TYPES = [
  { name: PricingModelType.FIXED, src: "/icons/fixed.png" },
  { name: PricingModelType.HOURLY_RATE, src: "/icons/hourly.png" },
  { name: PricingModelType.TIERED, src: "/icons/tiered.png" },
];
