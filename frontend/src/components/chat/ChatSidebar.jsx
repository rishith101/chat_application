import { useState, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useTheme } from "../../context/themecontext";
import { mapUserToConversation } from "../../hooks/useSelectedConversation";
import { useClerk, UserButton } from "@clerk/react";
import {
  MessageSquare,
  Users,
  Search,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { formatMessageTime } from "../../lib/utils";

export default function ChatSidebar() {
  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    users,
    conversations,
    selectedUser,
    setSelectedUser,
    getUsers,
    getConversations,
    isUsersLoading,
    isConversationsLoading,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useClerk();

  useEffect(() => {
    getUsers();
    getConversations();
  }, [getUsers, getConversations]);

  const mappedConversations = conversations.map((u) => mapUserToConversation(u, onlineUsers));
  const mappedUsers = users.map((u) => mapUserToConversation(u, onlineUsers));

  const filteredConversations = mappedConversations.filter((c) =>
    c?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mappedUsers.filter((u) =>
    u?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex flex-col h-full border-r border-border/50 bg-card/40 backdrop-blur-md">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserButton afterSignOutUrl="/auth" />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background"
              title="Online"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate text-foreground">
              {authUser?.fullName || "Messages"}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {onlineUsers.length} online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-accent/10 hover:text-foreground transition"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-xl hover:bg-destructive/10 hover:text-destructive transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-2 border-b border-border/40 bg-muted/20">
        <div className="grid grid-cols-2 p-1 gap-1 rounded-xl bg-muted/50 text-xs font-medium">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
              activeTab === "chats"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chats</span>
            {conversations.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-bold">
                {conversations.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
              activeTab === "users"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
            {users.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-muted-foreground/10 text-muted-foreground font-semibold">
                {users.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={activeTab === "chats" ? "Search conversations..." : "Search users..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-muted/40 border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition text-foreground placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      {/* Conversations / Users List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {activeTab === "chats" ? (
          isConversationsLoading ? (
            <SidebarSkeleton />
          ) : filteredConversations.length === 0 ? (
            <EmptySidebarState
              icon={MessageSquare}
              title="No chats yet"
              subtitle={
                searchQuery
                  ? "No conversation matches your search"
                  : "Start a conversation with anyone in the Users tab!"
              }
            />
          ) : (
            filteredConversations.map((item) => {
              const isSelected = selectedUser?._id === item.id || selectedUser?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedUser(item.rawUser)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left group ${
                    isSelected
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-accent/10 border border-transparent"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-border/40 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        item.initials
                      )}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-background ${
                        item.isOnline ? "bg-emerald-500" : "bg-neutral-400 dark:bg-neutral-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.lastMessageAt && (
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {formatMessageTime(item.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.isOnline ? (
                        <span className="text-emerald-500 font-medium">Online</span>
                      ) : (
                        "Offline"
                      )}
                    </p>
                  </div>
                </button>
              );
            })
          )
        ) : isUsersLoading ? (
          <SidebarSkeleton />
        ) : filteredUsers.length === 0 ? (
          <EmptySidebarState
            icon={Users}
            title="No users found"
            subtitle={
              searchQuery ? "No user matches your query" : "No other users registered in the system."
            }
          />
        ) : (
          filteredUsers.map((item) => {
            const isSelected = selectedUser?._id === item.id || selectedUser?.id === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedUser(item.rawUser)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${
                  isSelected
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent/10 border border-transparent"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-primary/10 border border-border/40 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      item.initials
                    )}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-background ${
                      item.isOnline ? "bg-emerald-500" : "bg-neutral-400 dark:bg-neutral-600"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.isOnline ? (
                      <span className="text-emerald-500 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Online
                      </span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
          <div className="w-11 h-11 rounded-full bg-muted/60" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-muted/60 rounded w-2/3" />
            <div className="h-2.5 bg-muted/40 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptySidebarState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-48 space-y-2">
      <div className="p-3 rounded-full bg-muted/30 text-muted-foreground">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-xs">{subtitle}</p>
    </div>
  );
}
