import { JobStatus } from "@prisma/client";

export const getChipColor = (status: JobStatus) => {
  switch (status) {
    case "PENDING":
      return "default";

    case "ACCEPTED":
      return "primary";

    case "REJECTED":
      return "error";

    case "ACTIVE":
      return "info";

    case "COMPLETED":
      return "success";

    default:
      return "default";
  }
};
