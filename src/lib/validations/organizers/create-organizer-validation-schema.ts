import * as Yup from "yup";

export const createOrganizerValidationSchema = Yup.object({
  user_id: Yup.string().required("User id required"),
});
