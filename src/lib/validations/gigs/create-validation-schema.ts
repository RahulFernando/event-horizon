import * as Yup from "yup";

export const createGigValidationSchema = Yup.object({
  title: Yup.string().required("Title id required"),
  location: Yup.string().required("Location is required"),
  category_id: Yup.string().required("Category is required"),
  vendor_id: Yup.string().required("Vendor Id is required"),
  event_type_ids: Yup.array()
    .of(Yup.string())
    .min(1, "At lease one event type is required"),
});
