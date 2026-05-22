import { UserType } from "@prisma/client";

export interface Address {
  number?: string;
  line_1: string;
  line_2?: string;
  country: string;
  state?: string;
  postal_code: string;
}

export interface User {
  name: string;
  contacts: string[];
  user_type: UserType;
  addresses: Address[];
}

export interface UserRating {
  rating: number;
}

export interface Gig {
  id: string;
  user_ratings: UserRating[];
}

export interface Vendor {
  id: number;
  business_registration: string | null;
  taxpayer_identification_number: string | null;
  created_at: Date;
  updated_at: Date;
  user: {
    name: string;
    contacts: string[];
  };
  is_deleted: boolean;
  gigs: Gig[];
}

export type VendorWithRating = Omit<Vendor, "gigs"> & {
  averageRating: number;
  totalRatings: number;
};
