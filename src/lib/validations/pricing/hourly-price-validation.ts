import * as Yup from "yup";

export const hourlyPriceValidationSchema = Yup.object({
  price: Yup.number().required("Price is required"),
  hour: Yup.string().required("Hour is required"),
});
