import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useSoundStore } from "./useSoundStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  conversations: [],
  selectedUser: null,
  activeConversationId: null,
  isUsersLoading: false,
  isConversationsLoading: false,
  isMessagesLoading: false,
  isSending: false,

  setSelectedUser: (selectedUser) => {
    const id = selectedUser?._id || selectedUser?.id || null;
    set({ selectedUser, activeConversationId: id });

    if (id) {
      get().getMessages(id);
    }
  },

  setActiveConversationId: (activeConversationId) => {
    const { users, conversations } = get();

    const user =
      users.find(
        (u) =>
          u._id === activeConversationId ||
          u.id === activeConversationId
      ) ||
      conversations.find(
        (u) =>
          u._id === activeConversationId ||
          u.id === activeConversationId
      ) ||
      null;

    set({ activeConversationId, selectedUser: user });

    if (activeConversationId) {
      get().getMessages(activeConversationId);
    }
  },

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({
        users: Array.isArray(res.data) ? res.data : [],
      });
    } catch (error) {
      console.warn("Could not fetch users:", error?.message);
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getConversations: async () => {
    set({ isConversationsLoading: true });

    try {
      const res = await axiosInstance.get("/messages/conversations");
      set({
        conversations: Array.isArray(res.data) ? res.data : [],
      });
    } catch (error) {
      console.warn("Could not fetch conversations:", error?.message);
      set({ conversations: [] });
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;

    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const fetchedMessages = Array.isArray(res.data) ? res.data : [];

      set({
        messages: fetchedMessages,
      });
    } catch (error) {
      console.warn("Could not fetch messages:", error?.message);
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { activeConversationId, selectedUser, messages } = get();

    const targetId =
      activeConversationId ||
      selectedUser?._id ||
      selectedUser?.id;

    if (!targetId) return;

    set({ isSending: true });

    try {
      const formData = new FormData();

      if (messageData.text) {
        formData.append("text", messageData.text);
      }

      if (messageData.file) {
        formData.append("media", messageData.file);
      }

      const res = await axiosInstance.post(
        `/messages/send/${targetId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const sentMsg = res.data;

      set({
        messages: [...messages, sentMsg],
      });

      useSoundStore.getState().playSentSound();
      get().getConversations();

      return sentMsg;
    } catch (error) {
      console.error("Error sending message:", error);

      const authUser = useAuthStore.getState().authUser;

      // Optimistic message fallback only for text messages
      const optimisticMsg = {
        _id: "local_" + Date.now(),
        senderId:
          authUser?._id ||
          authUser?.id ||
          "my_id",
        receiverId: targetId,
        text: messageData.text || "",
        image:
          messageData.previewUrl &&
            !messageData.file?.type?.startsWith("video")
            ? messageData.previewUrl
            : null,
        video:
          messageData.previewUrl &&
            messageData.file?.type?.startsWith("video")
            ? messageData.previewUrl
            : null,
        createdAt: new Date().toISOString(),
      };

      // Do not show a fake message when an image/video upload fails
      if (!messageData.file) {
        set({
          messages: [...messages, optimisticMsg],
        });
      }

      toast.error(
        error.response?.data?.message ||
        "Message delivery failed"
      );
    } finally {
      set({ isSending: false });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const {
        activeConversationId,
        selectedUser,
        messages,
      } = get();

      const currentChatId =
        activeConversationId ||
        selectedUser?._id ||
        selectedUser?.id;

      const isForActiveChat =
        currentChatId &&
        (
          newMessage.senderId === currentChatId ||
          newMessage.receiverId === currentChatId
        );

      if (isForActiveChat) {
        const isDuplicate = messages.some(
          (m) =>
            m._id === newMessage._id ||
            m.id === newMessage._id
        );

        if (!isDuplicate) {
          set({
            messages: [...messages, newMessage],
          });

          const authUser =
            useAuthStore.getState().authUser;

          if (
            newMessage.senderId !== authUser?._id
          ) {
            useSoundStore
              .getState()
              .playNotificationSound();
          }
        }
      } else {
        const authUser =
          useAuthStore.getState().authUser;

        if (
          newMessage.senderId !== authUser?._id
        ) {
          useSoundStore
            .getState()
            .playNotificationSound();
        }
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