import React, { createContext, useState, useEffect } from "react";
import { initializeSocket } from "@/lib/socket";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  conversation_id: string;
  sent_at: string;
  sender: {
    id: string;
    name: string;
    user_type: string;
    account?: {
      profile_picture_url?: string;
    };
  };
  read_receipts: Array<{
    id: string;
    message_id: string;
    participant_id: string;
    read_at: string;
  }>;
};

type ConversationType = {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  participants: Array<{
    id: string;
    user_id: string;
    user: {
      id: string;
      name: string;
      user_type: string;
      account?: {
        profile_picture_url?: string;
      };
    };
  }>;
  messages: Message[];
};

type ChatContextType = {
  activeConversation: ConversationType | null;
  setActiveConversation: (conversation: ConversationType | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  conversations: ConversationType[];
  setConversations: (conversations: ConversationType[]) => void;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;
  loading: boolean;
  currentUser: { id: string; name: string } | null;
};

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const MessagesProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
  userName: string;
}> = ({ children, userId, userName }) => {
  const [activeConversation, setActiveConversation] =
    useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [oldestMessageDate, setOldestMessageDate] = useState<string | null>(
    null
  );
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser] = useState({ id: userId, name: userName });

  useEffect(() => {
    if (!userId) return;

    const socket = initializeSocket(userId);

    socket.on("new_message", (message: Message) => {
      if (
        activeConversation &&
        message.conversation_id === activeConversation.id
      ) {
        setMessages((prev) => [message, ...prev]);
      }

      // Update conversation list to show latest message
      setConversations((prevConversations) => {
        return prevConversations
          .map((conv) => {
            if (conv.id === message.conversation_id) {
              return {
                ...conv,
                messages: [message],
                updated_at: message.sent_at,
              };
            }
            return conv;
          })
          .sort(
            (a, b) =>
              new Date(b.messages[0]?.sent_at || b.updated_at).getTime() -
              new Date(a.messages[0]?.sent_at || a.updated_at).getTime()
          );
      });
    });

    loadConversations();

    return () => {
      socket.off("new_message");
    };
  }, [userId, activeConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/conversations");
      if (!response.ok) throw new Error("Failed to load conversations");
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );
      if (!response.ok) throw new Error("Failed to load messages");
      const data = await response.json();

      setMessages(data);
      setOldestMessageDate(
        data.length > 0 ? data[data.length - 1].sent_at : null
      );
      setHasMoreMessages(data.length === 50); // Default limit is 50
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!activeConversation || !oldestMessageDate || !hasMoreMessages) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/conversations/${activeConversation.id}/messages?before=${oldestMessageDate}`
      );
      if (!response.ok) throw new Error("Failed to load more messages");
      const data = await response.json();

      if (data.length > 0) {
        setMessages((prev) => [...prev, ...data]);
        setOldestMessageDate(data[data.length - 1].sent_at);
        setHasMoreMessages(data.length === 50);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!activeConversation) return;

    try {
      const response = await fetch(
        `/api/conversations/${activeConversation.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        activeConversation,
        messages,
        conversations,
        hasMoreMessages,
        loading,
        currentUser,
        setActiveConversation,
        setMessages,
        setConversations,
        loadMessages,
        sendMessage,
        loadMoreMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
