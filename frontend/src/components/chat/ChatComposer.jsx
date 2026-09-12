import { useState, useRef } from "react";
import { Send, X, Loader2, Paperclip } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useKeyboardSound } from "../../hooks/useKeyboardSound";
import toast from "react-hot-toast";

export function ChatComposer() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const sendMessage = useChatStore((state) => state.sendMessage);
  const isSending = useChatStore((state) => state.isSending);
  const { handleKeyDown } = useKeyboardSound();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check size limit (10MB for Cloudinary / backend)
    if (selectedFile.size > 30 * 1024 * 1024) {
      toast.error("File size must be under 15MB");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if ((!text.trim() && !file) || isSending) return;

    const messageData = {
      text: text.trim(),
      file,
      previewUrl,
    };

    setText("");

    const result = await sendMessage(messageData);

    if (result) {
      removeFile();
    }
  };

  const onInputKeyDown = (e) => {
    handleKeyDown(e);

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="p-3 border-t border-border/50 bg-card/30 backdrop-blur-md">
      {/* File Preview Chip if selected */}
      {previewUrl && (
        <div className="mb-2 relative inline-block">
          <div className="relative size-20 rounded-xl overflow-hidden border border-border bg-black/40 shadow-md">
            {file?.type?.startsWith("video") ? (
              <video
                src={previewUrl}
                className="size-full object-cover"
                muted
              />
            ) : (
              <img
                src={previewUrl}
                alt="Upload preview"
                className="size-full object-cover"
              />
            )}

            <button
              type="button"
              onClick={removeFile}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-black text-white transition"
              title="Remove attachment"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Media Upload Trigger Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach photo or video"
          className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95 transition shrink-0"
        >
          <Paperclip className="size-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Type a message..."
          disabled={isSending}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-muted/40 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !file) || isSending}
          title="Send message"
          className="p-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition shadow-xs flex items-center justify-center shrink-0"
        >
          {isSending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className="size-5" />
          )}
        </button>
      </form>
    </footer>
  );
}

export default ChatComposer;