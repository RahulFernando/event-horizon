import * as Yup from "yup";

export const eventValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  date_time: Yup.string().required("Date Time is required"),
  event_type_id: Yup.string().required("Event Type is required"),
  venue: Yup.string().required("Venue is required"),
  organizer_id: Yup.string().required("Organizer is required"),
});
