import { ArrowLeft } from "lucide-react";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { useChatStore } from "../../store/useChatStore";
import { ThemeControlToolbar } from "../ThemeControlToolbar";

export function ChatHeader() {
  const { activeConversation, activeConversationId } = useSelectedConversation();
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);

  return (
    <header className="relative z-30 h-16 px-4 border-b border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        {activeConversationId && (
          <button
            type="button"
            onClick={() => setActiveConversationId(null)}
            className="lg:hidden p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition cursor-pointer"
            title="Back to contacts"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}

        {/* Peer Profile Info */}
        {activeConversation ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-border overflow-hidden">
                {activeConversation.peer.avatarUrl ? (
                  <img
                    src={activeConversation.peer.avatarUrl}
                    alt={activeConversation.peer.name}
                    className="size-full object-cover"
                  />
                ) : (
                  activeConversation.peer.initials
                )}
              </div>
              {activeConversation.peer.isOnline && (
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-foreground truncate">
                {activeConversation.peer.name}
              </h2>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                {activeConversation.peer.isOnline ? (
                  <>
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="text-emerald-500 font-medium">Online</span>
                  </>
                ) : (
                  <span>Offline</span>
                )}
                <span>•</span>
                <span className="truncate">{activeConversation.peer.subtitle}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">
              Select a conversation
            </span>
          </div>
        )}
      </div>

      {/* Right Controls - Always Interactive and Visible */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeControlToolbar compact={true} />
      </div>
    </header>
  );
}

export default ChatHeader;
