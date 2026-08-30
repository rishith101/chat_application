import { X, Download } from "lucide-react";

export function MediaPreviewModal({ mediaUrl, isVideo = false, onClose }) {
  if (!mediaUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-card border border-border/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition"
            title="Download Media"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        )}
      </div>
    </div>
  );
}
