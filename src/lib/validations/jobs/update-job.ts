import { JobStatus } from "@prisma/client";
import * as Yup from "yup";

export const jobStatusUpdateSchema = Yup.object({
  status: Yup.string()
    .oneOf(
      Object.values(JobStatus),
      "Status must be one of: PENDING, ACCEPTED, REJECTED, ACTIVE, COMPLETED"
    )
    .required("Status is required"),
});
