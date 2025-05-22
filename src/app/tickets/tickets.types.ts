import { Ticket, TicketStatus } from "@prisma/client";

export interface TicketCardProps {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: Date;
  onDeleteClick: (
    id: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface TicketFormInput {
  title: string;
  description: string;
}

export interface TicketFormProps {
  ticket?: Ticket;
}

export interface CommentProps {
  id: string;
  body: string;
  createdBy: string;
  createdAt: Date;
  bgcolor?: string;
  onDeleteClick: (id: string) => void;
}

export interface TicketCommentFormInput {
  body: string;
}
