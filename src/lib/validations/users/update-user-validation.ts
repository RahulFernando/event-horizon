import * as Yup from "yup";

export const updateUserValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  addresses: Yup.array().of(
    Yup.object({
      line_1: Yup.string().required("Line 1 is required"),
      country: Yup.string().required("Country is required"),
      postal_code: Yup.string().required("Postal code is required"),
    })
  ),
  contacts: Yup.array().of(
    Yup.string().min(1, "At least one contact number is required")
  ),
});

export const organizerValidationSchema = Yup.object({
  first_name: Yup.string().required("First Name is required"),
});
