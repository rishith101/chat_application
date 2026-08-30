import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  conversations: [],
  selectedUser: null,
  isUsersLoading: false,
  isConversationsLoading: false,
  isMessagesLoading: false,
  isSending: false,

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      get().getMessages(selectedUser._id || selectedUser.id);
    }
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      let res;
      try {
        res = await axiosInstance.get("/messages/users");
      } catch {
        res = await axiosInstance.get("/auth/users");
      }
      set({ users: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.warn("Could not fetch users from backend:", error?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try {
      let res;
      try {
        res = await axiosInstance.get("/messages/conversations");
      } catch {
        res = await axiosInstance.get("/auth/conversations");
      }
      set({ conversations: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.warn("Could not fetch conversations from backend:", error?.message);
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      let res;
      try {
        res = await axiosInstance.get(`/messages/${userId}`);
      } catch {
        res = await axiosInstance.get(`/auth/${userId}`);
      }
      const fetchedMessages = Array.isArray(res.data) ? res.data : [];
      // Backend returns newest first or oldest first. If newest first, reverse for chat chronology
      if (fetchedMessages.length > 1 && new Date(fetchedMessages[0].createdAt) > new Date(fetchedMessages[1].createdAt)) {
        fetchedMessages.reverse();
      }
      set({ messages: fetchedMessages });
    } catch (error) {
      console.warn("Could not fetch messages:", error?.message);
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    const targetId = selectedUser._id || selectedUser.id;
    set({ isSending: true });

    try {
      let res;
      const formData = new FormData();
      if (messageData.text) formData.append("text", messageData.text);
      if (messageData.file) formData.append("media", messageData.file);

      try {
        res = await axiosInstance.post(`/messages/send/${targetId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        res = await axiosInstance.post(`/auth/send/${targetId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const sentMsg = res.data;
      set({ messages: [...messages, sentMsg] });
      get().getConversations(); // refresh sidebar list
      return sentMsg;
    } catch (error) {
      const authUser = useAuthStore.getState().authUser;
      // Optimistic message fallback if backend fails due to backend route issue
      const optimisticMsg = {
        _id: "opt_" + Date.now(),
        senderId: authUser?._id || authUser?.id || "my_id",
        receiverId: targetId,
        text: messageData.text || "",
        image: messageData.previewUrl || null,
        createdAt: new Date().toISOString(),
      };
      set({ messages: [...messages, optimisticMsg] });
      toast.error(error.response?.data?.message || "Message sent (local preview mode)");
    } finally {
      set({ isSending: false });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      const authUser = useAuthStore.getState().authUser;

      const isForActiveChat =
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.senderId === selectedUser.id ||
          newMessage.receiverId === selectedUser._id ||
          newMessage.receiverId === selectedUser.id);

      if (isForActiveChat) {
        set({ messages: [...messages, newMessage] });
      }
      get().getConversations();
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
}));
