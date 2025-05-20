import { KeyedMutator } from "swr";
import { IUserInfo } from "../types";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface PersonalInfoFormInputs {
  name: string;
  contacts: { phone: string }[];
  addresses: {
    addressId?: string;
    number: string;
    line_1: string;
    line_2?: string;
    state?: string;
    country: string;
    postal_code: string;
    is_default: boolean;
  }[];
}

export interface NonEditablePersonalInfoProps {
  user?: IUserInfo;
}

export interface EditablePersonalInfoProps
  extends NonEditablePersonalInfoProps {
  refetchUser: KeyedMutator<IUserInfo>;
}

export interface PersonalInfoArgs
  extends Omit<PersonalInfoFormInputs, "contacts"> {
  contacts: string[];
}

export interface VendorAccountFormInputs {
  business_registration?: string;
  taxpayer_identification_number?: string;
}

export interface OrganizerAccountFormInputs {
  first_name: string;
  last_name?: string;
  national_identity?: string;
}

export interface EditableOrganizerAccountProps {
  register: UseFormRegister<OrganizerAccountFormInputs>;
  errors: FieldErrors<OrganizerAccountFormInputs>;
}

export interface EditableVendorAccountProps {
  register: UseFormRegister<VendorAccountFormInputs>;
  errors: FieldErrors<VendorAccountFormInputs>;
}
