import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[@$!%*?&]/, "Password must contain a special character")
    .required("Password is required"),
  user: Yup.object({
    name: Yup.string().required("Name is required"),
    contacts: Yup.array().of(
      Yup.string().min(1, "At least one contact number is required")
    ),
    addresses: Yup.array().of(
      Yup.object({
        line_1: Yup.string().required("Line 1 is required"),
        country: Yup.string().required("Country is required"),
        postal_code: Yup.string().required("Postal code is required"),
      })
    ),
  }),
});
