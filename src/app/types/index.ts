import { Gig, PricingModelType } from "@prisma/client";

export interface IEventType {
  id: string;
  name: string;
}

export interface IEventTypeOnGig {
  id: string;
  event_type: IEventType;
}

export interface IUser {
  id: string;
  name: string;
}

export interface IVendor {
  id: string;
  user: IUser;
}

export interface IEventTypesOnGig {
  event_type: {
    id: string;
    name: string;
  };
}

export interface IGig extends Gig {
  event_types: IEventTypesOnGig[];
}

export interface IPricing {
  id: string;
  type: PricingModelType;
  fixed_rate?: {
    id: string;
    price: number;
  };
  hourly_rate?: {
    hour: string;
    price: number;
  };
  tiered?: {
    id: string;
    pricing_tiers: {
      id: string;
      level: string;
      description: string;
      price: number;
    }[];
  };
}
