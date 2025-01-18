import * as Yup from "yup";

export const createFixedPriceValidationSchema = Yup.object({
  price: Yup.number().required("Price is required"),
});
