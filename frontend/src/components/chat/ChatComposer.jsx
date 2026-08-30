import { useState, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useSoundStore } from "../../store/useSoundStore";
import useKeyboardSound from "../../hooks/useKeyboardSound";
import { Send, X, Loader2, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

let lastSoundTime = 0;
const SOUND_THROTTLE_MS = 50;

export function ChatComposer() {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);
  const { sendMessage, isSending, selectedUser } = useChatStore();
  const { soundEnabled } = useSoundStore();
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  if (!selectedUser) return null;

  const handleTextChange = (e) => {
    setText(e.target.value);

    // Play keystroke sound if sound settings are enabled
    if (soundEnabled) {
      const now = Date.now();
      if (now - lastSoundTime >= SOUND_THROTTLE_MS) {
        lastSoundTime = now;
        playRandomKeyStrokeSound();
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please select an image or video file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be under 20MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!text.trim() && !selectedFile) || isSending) return;

    const messageData = {
      text: text.trim(),
      file: selectedFile,
      previewUrl,
    };

    setText("");
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    await sendMessage(messageData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-border/40 bg-card/60 backdrop-blur-md">
      {/* File Attachment Preview */}
      {previewUrl && (
        <div className="mb-2 relative inline-block group">
          <div className="relative rounded-xl overflow-hidden border border-border/50 bg-muted/30 max-w-xs shadow-md">
            {selectedFile?.type.startsWith("video/") ? (
              <video src={previewUrl} className="h-20 w-auto object-cover" />
            ) : (
              <img src={previewUrl} alt="Preview" className="h-20 w-auto object-cover" />
            )}
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm transition"
              title="Remove attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Composer Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2.5 rounded-xl border transition flex-shrink-0 ${
            selectedFile
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-muted/40 border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
          title="Attach image or video"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Area Input */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedUser.fullName || "user"}...`}
            rows={1}
            disabled={isSending}
            className="w-full resize-none py-2.5 px-4 text-xs sm:text-sm rounded-xl bg-muted/40 border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/70 transition max-h-32"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !selectedFile) || isSending}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-xs transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          title="Send message"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
