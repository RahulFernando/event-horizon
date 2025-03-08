import useSWR from "swr";
// import { useState } from "react";
import { Conversation, Message } from "../contexts/chat/chat-context.types";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }
  return response.json();
};

export function useConversations() {
  const { data, error, isLoading, mutate } = useSWR<Conversation[]>(
    "/api/conversations",
    fetcher
  );

  return {
    conversations: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMessages(conversationId: string | null) {
  //   const [limit, setLimit] = useState(50);
  //   const [hasMore, setHasMore] = useState(true);

  const { data, error, isLoading, mutate } = useSWR<Message[]>(
    conversationId ? `/api/conversations/${conversationId}/messages` : null,
    fetcher
  );

  const loadMore = async () => {
    if (!data || data.length === 0) return;

    const oldestMessage = data[data.length - 1];
    const oldestTime = new Date(oldestMessage.sent_at).toISOString();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/conversations/${conversationId}/messages?before=${oldestTime}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMessages = await response.json();

      mutate([...data, ...newMessages], false);
    } catch (error) {
      console.error("Error loading more messages:", error);
    }
  };

  return {
    messages: data || [],
    isLoading,
    isError: error,
    mutate,
    loadMore,
  };
}

type SendMessageParams = {
  conversationId: string;
  content: string;
};

async function sendMessageRequest(
  url: string,
  { arg }: { arg: SendMessageParams }
) {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: arg.content }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

export function useSendMessage(conversationId: string) {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation(
    `/api/conversations/${conversationId}/messages`,
    sendMessageRequest,
    {
      onSuccess: () => {
        mutate(`/api/conversations/${conversationId}/messages`);
        mutate("/api/conversations");
      },
    }
  );

  return {
    sendMessage: trigger,
    isSending: isMutating,
    error,
  };
}
