import { Gig, JobStatus } from "@prisma/client";
// import { IGig } from "../../events.type";

export interface SelectedGigItemProps {
  title: string;
  name: string;
  id: string;
  status?: JobStatus;
  gig: Gig;
  onDelete: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onClick: (gig: Gig, jobId: string, event: React.MouseEvent) => void;
}

// export interface SelectedGigsProps {
//   gigs: IGig[];
// }

export interface JobTitleProps {
  title: string;
  status: JobStatus;
}
