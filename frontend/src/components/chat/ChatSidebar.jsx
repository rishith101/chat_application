import { useState, useMemo } from "react";
import { useClerk } from "@clerk/react";
import { MessageSquare, Users, Search, LogOut } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useSelectedConversation, getInitials } from "../../hooks/useSelectedConversation";
import { AppLogo } from "./AppLogo";
import { ThemeControlToolbar } from "../ThemeControlToolbar";

export function ChatSidebar() {
  const [tab, setTab] = useState("chats"); // "chats" | "users"
  const [searchQuery, setSearchQuery] = useState("");

  const { signOut } = useClerk();
  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  const users = useChatStore((state) => state.users);
  const conversations = useChatStore((state) => state.conversations);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);
  const isConversationsLoading = useChatStore((state) => state.isConversationsLoading);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);

  const { activeConversationId, isLargeScreen } = useSelectedConversation();

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  return (
    <aside
      className={`w-full lg:w-80 flex-shrink-0 flex flex-col border-r border-border/50 bg-card/40 backdrop-blur-md relative z-20 transition-all ${
        !isLargeScreen && activeConversationId ? "hidden lg:flex" : "flex"
      }`}
    >
      {/* Header with App Logo, Profile, and Global Toolbar */}
      <div className="p-3.5 border-b border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={28} className="rounded-xl shadow-xs shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold tracking-tight text-foreground truncate">
              VibeChat
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">{authUser?.fullName || "Online"}</span>
            </span>
          </div>
        </div>

        {/* Global Theme & Sound Toolbar + Profile/Logout */}
        <div className="flex items-center gap-1 shrink-0">
          <ThemeControlToolbar compact={true} />
          <button
            type="button"
            onClick={() => signOut()}
            title="Sign Out"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-3 pb-2">
        <div className="grid grid-cols-2 p-1 rounded-xl bg-muted/60 border border-border/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("chats")}
            className={`flex items-center justify-center gap-2 py-1.5 rounded-lg transition cursor-pointer ${
              tab === "chats"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="size-3.5" />
            <span>Chats</span>
            {conversations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px]">
                {conversations.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`flex items-center justify-center gap-2 py-1.5 rounded-lg transition cursor-pointer ${
              tab === "users"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5" />
            <span>Contacts</span>
            {users.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-muted-foreground/20 text-muted-foreground text-[10px]">
                {users.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pb-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={tab === "chats" ? "Search conversations..." : "Search contacts..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-muted/40 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Contact / Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {tab === "chats" ? (
          /* Chats List */
          isConversationsLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {searchQuery ? "No matching conversations." : "No recent conversations. Start chatting from Contacts!"}
            </div>
          ) : (
            filteredConversations.map((user) => {
              const isSelected = activeConversationId === user._id;
              const isOnline = onlineUsers.includes(user._id);

              return (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => setActiveConversationId(user._id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-xs"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-border overflow-hidden">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.fullName}
                          className="size-full object-cover"
                        />
                      ) : (
                        getInitials(user.fullName || "User")
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {user.fullName}
                      </p>
                      {isOnline && (
                        <span className="text-[10px] text-emerald-500 font-medium">
                          online
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              );
            })
          )
        ) : (
          /* Contacts List */
          isUsersLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
              Loading contacts...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {searchQuery ? "No contacts found." : "No contacts available."}
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = activeConversationId === user._id;
              const isOnline = onlineUsers.includes(user._id);

              return (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => setActiveConversationId(user._id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-xs"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-border overflow-hidden">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.fullName}
                          className="size-full object-cover"
                        />
                      ) : (
                        getInitials(user.fullName || "User")
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {user.fullName}
                      </p>
                      {isOnline && (
                        <span className="text-[10px] text-emerald-500 font-medium">
                          online
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              );
            })
          )
        )}
      </div>
    </aside>
  );
}

export default ChatSidebar;
