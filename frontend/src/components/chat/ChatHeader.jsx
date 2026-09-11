import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { ThemeControlToolbar } from "../ThemeControlToolbar";
import { ChevronLeft } from "lucide-react";

export function ChatHeader() {
  const { setSelectedUser } = useChatStore();
  const { activeConversation: peer } = useSelectedConversation();

  if (!peer) return null;

  return (
    <header className="px-4 py-3 border-b border-border/40 bg-card/60 backdrop-blur-md flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="lg:hidden p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          title="Back to conversations"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Recipient Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-border/40 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
            {peer.avatarUrl ? (
              <img
                src={peer.avatarUrl}
                alt={peer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              peer.initials
            )}
          </div>
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-background ${
              peer.isOnline ? "bg-emerald-500" : "bg-neutral-400 dark:bg-neutral-600"
            }`}
          />
        </div>

        {/* Recipient Details */}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {peer.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {peer.isOnline ? (
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Active now
              </span>
            ) : (
              "Offline"
            )}
          </p>
        </div>
      </div>

    </header>
  );
}
