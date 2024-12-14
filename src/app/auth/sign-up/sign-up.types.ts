/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Control, FieldArrayWithId, FieldError } from "react-hook-form";

export type UserType = "ORGANIZER" | "VENDOR";

export interface RoleSelectionProps {
  userType: UserType;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SignUpFormInputs {
  email: string;
  name: string;
  password: string;
  contacts: { phone: string }[];
  addresses: {
    number: string;
    line_1: string;
    line_2?: string;
    state?: string;
    country: string;
    postal_code: string;
  }[];
}

export interface ContactDetailsInputProps {
  control: Control<SignUpFormInputs, any>;
  error?: FieldError | undefined;
  errorMessage?: string | undefined;
  contactFields: FieldArrayWithId<SignUpFormInputs, "contacts", "id">[];
  onAppend: () => void;
  onRemove: (index: number) => void;
}

export interface AddressDetailsInputProps {
  control: Control<SignUpFormInputs, any>;
  addressFields: FieldArrayWithId<SignUpFormInputs, "addresses", "id">[];
}
