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
