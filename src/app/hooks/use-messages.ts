import { useContext } from "react";
import { ChatContext } from "../contexts/chat/chat-context";

export const useMessages = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
};
