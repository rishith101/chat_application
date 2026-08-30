import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import useScrollToBottom from "../../hooks/useScrollToBottom";
import { formatDateSeparator } from "../../lib/utils";
import { MediaPreviewModal } from "./MediaPreviewModal";
import { MessageSquareDashed, Image as ImageIcon, Play, Sparkles, Lock, ShieldCheck } from "lucide-react";

export function MessageList() {
  const { isMessagesLoading } = useChatStore();
  const { activeConversation, activeConversationId, mappedMessages } = useSelectedConversation();
  const [previewMedia, setPreviewMedia] = useState(null);

  // Hook for scrolling to bottom on new messages or conversation change
  const lastItemId = mappedMessages.length > 0 ? mappedMessages[mappedMessages.length - 1].id : null;
  const scrollRef = useScrollToBottom(activeConversationId, lastItemId);

  if (!activeConversation) {
    return <NoChatSelectedState />;
  }

  if (isMessagesLoading) {
    return <MessageSkeletonList />;
  }

  if (mappedMessages.length === 0) {
    return <EmptyConversationState activeConversation={activeConversation} />;
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Encryption notice */}
      <div className="flex justify-center my-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/40 border border-border/30 text-[11px] text-muted-foreground font-medium shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Messages are end-to-end encrypted</span>
        </div>
      </div>

      {mappedMessages.map((msg, index) => {
        const isSentByMe = msg.role === "me";
        const previousMsg = index > 0 ? mappedMessages[index - 1] : null;

        // Date separator calculation
        const currentDateStr = new Date(msg.createdAt).toDateString();
        const previousDateStr = previousMsg ? new Date(previousMsg.createdAt).toDateString() : null;
        const showDateSeparator = currentDateStr !== previousDateStr;

        return (
          <div key={msg.id} className="space-y-4">
            {showDateSeparator && (
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 rounded-full bg-muted/60 text-[11px] font-semibold text-muted-foreground border border-border/40">
                  {formatDateSeparator(msg.createdAt)}
                </span>
              </div>
            )}

            <div
              className={`flex items-end gap-2 ${
                isSentByMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Received Avatar */}
              {!isSentByMe && (
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-border/40 flex items-center justify-center text-[10px] font-bold text-primary mb-1 flex-shrink-0 overflow-hidden">
                  {activeConversation.avatarUrl ? (
                    <img
                      src={activeConversation.avatarUrl}
                      alt={activeConversation.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    activeConversation.initials
                  )}
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] space-y-1.5 ${
                  isSentByMe ? "items-end" : "items-start"
                }`}
              >
                {/* Media Attachment */}
                {(msg.imageUrl || msg.videoUrl) && (
                  <MediaMessageBubble
                    image={msg.imageUrl}
                    video={msg.videoUrl}
                    onPreview={(url, isVideo) => setPreviewMedia({ url, isVideo })}
                  />
                )}

                {/* Text Bubble */}
                {msg.text && (
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-xs ${
                      isSentByMe
                        ? "bg-primary text-primary-foreground rounded-br-xs font-normal"
                        : "bg-card border border-border/50 text-card-foreground rounded-bl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1 text-right font-medium opacity-75 ${
                        isSentByMe ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Media Zoom Preview Modal */}
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

function MediaMessageBubble({ image, video, onPreview }) {
  const [loaded, setLoaded] = useState(false);
  const mediaUrl = video || image;
  const isVideo = Boolean(video);

  return (
    <div
      onClick={() => onPreview(mediaUrl, isVideo)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group border border-border/50 bg-muted/40 max-w-sm transition hover:opacity-95 shadow-xs"
    >
      {!loaded && (
        <div className="w-64 h-48 bg-muted animate-pulse flex flex-col items-center justify-center text-muted-foreground gap-2">
          <ImageIcon className="w-6 h-6 opacity-40" />
          <span className="text-[11px]">Loading media...</span>
        </div>
      )}

      {isVideo ? (
        <div className="relative">
          <video
            src={mediaUrl}
            onLoadedData={() => setLoaded(true)}
            className={`max-h-60 w-full object-cover ${loaded ? "block" : "hidden"}`}
          />
          {loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                <Play className="w-6 h-6 fill-white" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <img
          src={mediaUrl}
          alt="Chat attachment"
          onLoad={() => setLoaded(true)}
          className={`max-h-60 w-full object-cover transition duration-200 group-hover:scale-105 ${
            loaded ? "block" : "hidden"
          }`}
        />
      )}
    </div>
  );
}

function MessageSkeletonList() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`flex items-end gap-2 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          {i % 2 !== 0 && <div className="w-7 h-7 rounded-full bg-muted animate-pulse" />}
          <div
            className={`p-3 rounded-2xl space-y-2 animate-pulse ${
              i % 2 === 0 ? "bg-primary/20 rounded-br-xs w-48" : "bg-card border border-border/40 rounded-bl-xs w-56"
            }`}
          >
            <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
            <div className="h-3 bg-muted-foreground/15 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NoChatSelectedState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-muted/10 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm animate-bounce">
        <MessageSquareDashed className="w-8 h-8" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h2 className="text-xl font-bold text-foreground">Select a conversation</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Choose a contact from the sidebar or start a new chat to begin messaging with sound effects and instant media delivery.
        </p>
      </div>
      <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Real-time presence</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>Encrypted messaging</span>
        </div>
      </div>
    </div>
  );
}

function EmptyConversationState({ activeConversation }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-lg font-bold text-primary shadow-md overflow-hidden">
        {activeConversation.avatarUrl ? (
          <img
            src={activeConversation.avatarUrl}
            alt={activeConversation.name}
            className="w-full h-full object-cover"
          />
        ) : (
          activeConversation.initials
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground">
        Say hi to {activeConversation.name}!
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs">
        No previous messages in this chat. Type a message below to start the conversation.
      </p>
    </div>
  );
}
