import { X, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useState } from "react";

export function MediaPreviewModal({ mediaUrl, isVideo = false, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!mediaUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = isVideo ? "chat-video.mp4" : "chat-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(mediaUrl, "_blank");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Toolbar */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {!isVideo && (
          <>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
              title="Zoom In"
            >
              <ZoomIn className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
              title="Zoom Out"
            >
              <ZoomOut className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
              title="Rotate"
            >
              <RotateCw className="size-5" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={handleDownload}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
          title="Download"
        >
          <Download className="size-5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
          title="Close"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Media Content */}
      <div
        className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain bg-black"
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Preview"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: "transform 0.15s ease-out",
            }}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl select-none"
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}
export default MediaPreviewModal;
