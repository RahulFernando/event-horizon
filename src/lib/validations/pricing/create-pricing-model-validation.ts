import { PricingModelType } from "@prisma/client";
import * as Yup from "yup";

export const createPricingModelValidationSchema = Yup.object({
  type: Yup.string()
    .oneOf([
      PricingModelType.FIXED,
      PricingModelType.HOURLY_RATE,
      PricingModelType.TIERED,
    ])
    .required("Type is required"),
});
