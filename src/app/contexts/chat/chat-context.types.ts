export interface User {
  id: string;
  name: string;
  user_type: string;
  account?: {
    profile_picture_url?: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  sender: User;
  read_receipts: ReadReceipt[];
}

export interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  participants: ConversationParticipant[];
  messages: Message[];
}

export interface ConversationParticipant {
  id: string;
  user_id: string;
  conversation_id: string;
  joined_at: string;
  is_active: boolean;
  user: User;
}

export interface ReadReceipt {
  id: string;
  message_id: string;
  participant_id: string;
  read_at: string;
}

export interface UserTyping {
  userId: string;
  userName: string;
  isTyping: boolean;
}
