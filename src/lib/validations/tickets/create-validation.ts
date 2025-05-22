import * as Yup from "yup";

export const createTicketValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
});
