import { useEffect, useRef, useState } from "react";
import { MessageSquare, ArrowDown, Play } from "lucide-react";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { useChatStore } from "../../store/useChatStore";
import { formatDateSeparator } from "../../lib/utils";
import { MediaPreviewModal } from "./MediaPreviewModal";

export function MessageList() {
  const { activeConversation, activeConversationId } = useSelectedConversation();
  const isMessagesLoading = useChatStore((state) => state.isMessagesLoading);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const [previewMedia, setPreviewMedia] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Auto-scroll to bottom on messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation?.messages]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    const isUp = scrollHeight - scrollTop - clientHeight > 120;

    setShowScrollDown(isUp);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // No active conversation selected state
  if (!activeConversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/10 text-muted-foreground select-none">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
          <MessageSquare className="size-8" />
        </div>

        <h3 className="text-base font-bold text-foreground">
          Welcome to VibeChat
        </h3>

        <p className="text-xs max-w-xs mt-1 text-muted-foreground leading-relaxed">
          Select a contact or existing conversation from the sidebar to start
          real-time messaging with instant audio feedback.
        </p>
      </div>
    );
  }

  // Loading state
  if (isMessagesLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
        <div className="flex justify-start">
          <div className="w-48 h-12 rounded-2xl bg-muted animate-pulse" />
        </div>

        <div className="flex justify-end">
          <div className="w-64 h-16 rounded-2xl bg-muted animate-pulse" />
        </div>

        <div className="flex justify-start">
          <div className="w-56 h-14 rounded-2xl bg-muted animate-pulse" />
        </div>

        <div className="flex justify-end">
          <div className="w-40 h-12 rounded-2xl bg-muted animate-pulse" />
        </div>

        <div className="flex justify-start">
          <div className="w-72 h-20 rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  const messages = activeConversation?.messages || [];

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden bg-background/50">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <p className="text-xs font-medium">
              No messages in this chat yet.
            </p>

            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
              Send a message below to start the conversation! 👋
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMe = message.role === "me";
            const prevMessage = messages[index - 1];

            const showDateSeparator =
              !prevMessage ||
              (message.rawDate &&
                prevMessage.rawDate &&
                new Date(message.rawDate).toDateString() !==
                new Date(prevMessage.rawDate).toDateString());

            return (
              <div key={message.id || index} className="space-y-3">
                {/* Date separator if applicable */}
                {showDateSeparator && message.rawDate && (
                  <div className="flex items-center justify-center my-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-muted/60 text-muted-foreground border border-border/40 backdrop-blur-xs">
                      {formatDateSeparator(message.rawDate)}
                    </span>
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"
                    }`}
                >
                  {/* Peer Avatar on left */}
                  {!isMe && (
                    <div className="size-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 border border-border overflow-hidden mb-1">
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
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3 shadow-xs space-y-1.5 transition ${isMe
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : "bg-card border border-border/60 text-foreground rounded-bl-xs"
                      }`}
                  >
                    {/* Media Attachments */}
                    {message.imageUrl && (
                      <div
                        className="relative rounded-xl overflow-hidden cursor-pointer group bg-black/20 max-w-sm"
                        onClick={() =>
                          setPreviewMedia({
                            url: message.imageUrl,
                            isVideo: false,
                          })
                        }
                      >
                        <img
                          src={message.imageUrl}
                          alt="Attachment"
                          className="w-full max-h-72 object-cover rounded-xl transition group-hover:scale-102"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {message.videoUrl && (
                      <div
                        className="relative rounded-xl overflow-hidden cursor-pointer group bg-black/40 max-w-sm"
                        onClick={() =>
                          setPreviewMedia({
                            url: message.videoUrl,
                            isVideo: true,
                          })
                        }
                      >
                        <video
                          src={message.videoUrl}
                          className="w-full max-h-72 object-cover rounded-xl"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition">
                          <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg">
                            <Play className="size-6 fill-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Text content */}
                    {message.text && (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                    )}

                    {/* Timestamp */}
                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] ${isMe
                          ? "text-primary-foreground/75"
                          : "text-muted-foreground"
                        }`}
                    >
                      <span>{message.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollDown && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-6 p-2 rounded-full bg-card/90 border border-border text-foreground shadow-lg hover:bg-muted transition backdrop-blur-md"
          title="Scroll to latest message"
        >
          <ArrowDown className="size-4" />
        </button>
      )}

      {/* Media Preview Modal */}
      {previewMedia && (
        <MediaPreviewModal
          mediaUrl={previewMedia.url}
          isVideo={previewMedia.isVideo}
          onClose={() => setPreviewMedia(null)}
        />
      )}
    </div>
  );
}

export default MessageList;