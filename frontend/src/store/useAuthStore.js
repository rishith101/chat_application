import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  setAuthUser: (user) => {
    set({ authUser: user });
    if (user) {
      get().connectSocket(user);
      useChatStore.getState().getUsers();
      useChatStore.getState().getConversations();
    }
  },

  checkAuth: async (clerkUser) => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket(res.data);
      useChatStore.getState().getUsers();
      useChatStore.getState().getConversations();
    } catch (error) {
      console.warn("Backend auth check endpoint error, using session user fallback:", error?.message);
      if (clerkUser) {
        const fallbackUser = {
          _id: clerkUser.id,
          clerkId: clerkUser.id,
          fullName: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] || "User",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          profilePic: clerkUser.imageUrl || "",
        };
        set({ authUser: fallbackUser });
        get().connectSocket(fallbackUser);
        useChatStore.getState().getUsers();
        useChatStore.getState().getConversations();
      } else {
        set({ authUser: null });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    get().disconnectSocket();
  },

  connectSocket: (user) => {
    const userId = user?._id || user?.id;
    if (!userId || get().socket?.connected) return;

    const socket = io(BASE_URL, { query: { userId } });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds || [] });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },
}));