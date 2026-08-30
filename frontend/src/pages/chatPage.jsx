import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useSelectedConversation } from "../hooks/useSelectedConversation";
import ChatSidebar from "../components/chat/ChatSidebar";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { ChatComposer } from "../components/chat/ChatComposer";

function ChatPage() {
  const getConversations = useChatStore((state) => state.getConversations);
  const getMessages = useChatStore((state) => state.getMessages);
  const getUsers = useChatStore((state) => state.getUsers);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);

  const { activeConversation, activeConversationId, isLargeScreen } = useSelectedConversation();

  useEffect(() => {
    getUsers();
    getConversations();
  }, [getConversations, getUsers]);

  useEffect(() => {
    if (!activeConversationId) return;

    getMessages(activeConversationId);
    subscribeToMessages(activeConversationId);

    return () => unsubscribeFromMessages();
  }, [getMessages, activeConversationId, subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className="flex h-screen w-screen overflow-hidden p-2 sm:p-4 md:p-6 bg-background text-foreground relative">
      {/* Subtle Background Lighting */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl">
        {/* Left Sidebar Pane */}
        <div
          className={`h-full ${
            !isLargeScreen && activeConversationId ? "hidden" : "w-full lg:w-auto"
          }`}
        >
          <ChatSidebar />
        </div>

        {/* Main Conversation Window Pane */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden bg-card/20 ${
            !isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"
          }`}
        >
          <ChatHeader />
          <MessageList />
          {activeConversation && <ChatComposer />}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;