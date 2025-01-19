import { SelectChangeEvent } from "@mui/material";
import { EventType, PricingModelType, PricingTier } from "@prisma/client";
import {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { IPricing } from "../types";

export interface GigFormInputs {
  title: string;
  description?: string;
  location: string;
  event_type_ids: string[];
}

export interface GigFormProps {
  eventTypeIds: string[];
  submitBtnLabel?: string;
  isMutating?: boolean;
  eventTypes: EventType[];
  register: UseFormRegister<GigFormInputs>;
  onEventTypesChange: (event: SelectChangeEvent<string[]>) => void;
  handleSubmit: UseFormHandleSubmit<GigFormInputs, undefined>;
  onSubmit: (values: GigFormInputs) => void;
  reset: UseFormReset<GigFormInputs>;
}

export interface GigPostRequestPayload extends GigFormInputs {
  vendor_id: string;
}

export interface GigPreviewProps extends Pick<GigFormInputs, "description"> {
  id?: string;
  title?: string;
  location?: string;
  event_types?: string[];
  isActions?: boolean;
  onClick?: (id: string) => void;
}

export interface ModelSelectorProps {
  pricingModel: PricingModelType | undefined;
  isLoading: boolean;
  onPricingModelChange: (value: PricingModelType) => void;
}

export interface ITier
  extends Pick<PricingTier, "level" | "description" | "price"> {
  index: number;
  color: string;
}

export interface IPricingTier extends Pick<PricingTier, "level"> {
  id?: string;
  description?: string;
  price?: string;
}

export interface PricingTiersProps {
  tiers?: TierCardProps[];
}

export type TierCardProps = Omit<ITier, "index">;

export interface FixedPriceFormInputs {
  price: number;
}

export interface HourlyRateFormInputs extends FixedPriceFormInputs {
  hour: string;
}

export interface FixedPricingModelPayload {
  type: PricingModelType;
  fixed: { price: number };
}

export interface FixedPriceFormProps {
  price?: IPricing;
}

export interface HourlyRatePriceModelPayload {
  type: PricingModelType;
  hourlyRate: {
    hour: string;
    price: number;
  };
}

export interface TieredPriceModelPayload
  extends Pick<FixedPricingModelPayload, "type"> {
  type: PricingModelType;
  tiered: {
    pricingTiers: Pick<PricingTier, "level" | "description" | "price">[];
  };
}
