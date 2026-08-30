import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useMediaQuery } from "./useMediaQuery";
import { formatMessageTime } from "../lib/utils";

export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

export function mapUserToConversation(user, onlineUsers = []) {
  if (!user) return null;
  const id = user._id || user.id;
  const name = user.fullName || "User";
  const isOnline = onlineUsers.includes(id);
  const avatarUrl = user.profilePic || "";
  const initials = getInitials(name);
  const subtitle = isOnline ? "Online" : "Offline";

  return {
    id,
    name,
    subtitle,
    isOnline,
    avatarUrl,
    initials,
    rawUser: user,
    lastMessageAt: user.lastMessageAt,
  };
}

export function useSelectedConversation() {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const messages = useChatStore((state) => state.messages);
  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const activeConversationId = selectedUser?._id || selectedUser?.id || null;
  const selectedPeer = mapUserToConversation(selectedUser, onlineUsers);

  const myId = authUser?._id || authUser?.id;

  const mappedMessages = messages.map((msg, index) => {
    const isMe = msg.senderId === myId;
    return {
      id: msg._id || `msg_${index}`,
      role: isMe ? "me" : "them",
      text: msg.text || "",
      time: formatMessageTime(msg.createdAt),
      imageUrl: msg.image || null,
      videoUrl: msg.vedio || msg.video || null,
      createdAt: msg.createdAt,
      rawMessage: msg,
    };
  });

  return {
    activeConversation: selectedPeer,
    activeConversationId,
    selectedPeer,
    mappedMessages,
    isLargeScreen,
    getInitials,
    mapUserToConversation,
  };
}

export default useSelectedConversation;
