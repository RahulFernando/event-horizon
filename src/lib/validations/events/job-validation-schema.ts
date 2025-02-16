import * as Yup from "yup";

export const jobValidationSchema = Yup.object({
  gig_id: Yup.string().required("Gig is required"),
});
