import { IGig } from "../../events.type";

export interface SelectedGigItemProps {
  title: string;
  name: string;
  id: string;
  onDelete: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface SelectedGigsProps {
  gigs: IGig[];
}
