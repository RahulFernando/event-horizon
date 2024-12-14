export interface OrganizerFormInputs {
  first_name: string;
  last_name: string;
  national_identity: string;
}

export interface OrganizerArgs extends OrganizerFormInputs {
  user_id: string;
}

export interface OrganizerFormProps {
  isLoading: boolean;
  firstName?: string;
}
