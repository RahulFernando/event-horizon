import * as Yup from "yup";

export const createGigValidationSchema = Yup.object({
  title: Yup.string().required("Title id required"),
  location: Yup.string().required("Location is required"),
  vendor_id: Yup.string().required("Vendor Id is required"),
  event_type_id: Yup.string().required("Event Type Id is required"),
});
