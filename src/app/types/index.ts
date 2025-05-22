/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Account,
  Address,
  Category,
  Conversation,
  Event,
  Gig,
  Invoice,
  Job,
  JobStatus,
  Message,
  Organizer,
  Payment,
  PricingModelType,
  Ticket,
  User,
  UserType,
} from "@prisma/client";

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
  user_type: UserType;
  contacts?: string[];
}

export interface IUserInfo extends User {
  addresses: Address[];
  account: Account;
  vendors?: IVendor;
  organizers?: IOrganizer;
}

export interface IVendor {
  id: string;
  business_registration?: string;
  taxpayer_identification_number?: string;
  user: IUser;
  is_deleted?: boolean;
}

export interface IEventTypesOnGig {
  event_type: {
    id: string;
    name: string;
  };
}

export interface IGig extends Gig {
  category: Category;
  event_types: IEventTypesOnGig[];
  vendor: IVendor;
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

export interface IVendorGigs {
  count: number;
  items: IGig[];
}

export interface ICategories {
  count: number;
  items: Category[];
}

export interface IJob extends Job {
  gig: IGig;
  pricingTier?: {
    id: string;
    level: string;
    description: string;
    price: number;
  };
  status: JobStatus;
}

export interface DialogInfo {
  type?: string;
  data?: any;
}

export interface IVendorJob extends Job {
  gig: IGig;
  event: Event;
}

export interface ICalendar {
  id: string;
  job_id: string;
  date_time: string;
  job: IVendorJob;
}

export interface IParticipant {
  id: string;
  user_id: string;
  user: IUser;
}

export interface IConversation extends Conversation {
  participants: IParticipant[];
}

export interface IMessage extends Message {
  sender: IUser;
}

export interface IMonthlyGig extends Gig {
  pricing_mode: {
    type: PricingModelType;
    fixed_rate: {
      id: string;
      price: number;
    };
    hourly_rate: {
      id: string;
      hour: string;
      price: number;
    };
    tiered: {
      id: string;
      pricing_tiers: {
        id: string;
        level: string;
        description: string;
        price: number;
      }[];
    };
  };
}

export interface IMonthlyEarningJob extends Job {
  gig: IMonthlyGig;
  event: Event;
  pricingTier?: {
    id: string;
    level: string;
    description: string;
    price: number;
  };
}

export interface IMonthlyEarning {
  month: string;
  earnings: number;
  [key: string]: string | number;
}

export interface IJobInvoice extends Invoice {
  payments: Payment[];
}

export interface IOrganizer extends Organizer {
  user: User;
}

export interface IEvent extends Event {
  event_type: IEventType;
}

export interface ITicket extends Ticket {
  user: IUser;
}
