import { JobStatus } from "@prisma/client";
import { IGig } from "../../events.type";

export interface SelectedGigItemProps {
  title: string;
  name: string;
  id: string;
  status?: JobStatus;
  onDelete: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface SelectedGigsProps {
  gigs: IGig[];
}

export interface JobTitleProps {
  title: string;
  status: JobStatus;
}
