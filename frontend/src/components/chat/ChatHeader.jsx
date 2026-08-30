import { useChatStore } from "../../store/useChatStore";
import { useSoundStore } from "../../store/useSoundStore";
import { useTheme } from "../../context/themecontext";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { HERO_UI_THEME_PRESETS } from "../../data/heroutheampresets";
import { Volume2, VolumeX, ChevronLeft, Palette } from "lucide-react";
import { useState } from "react";

export function ChatHeader() {
  const { setSelectedUser } = useChatStore();
  const { soundEnabled, toggleSound } = useSoundStore();
  const { themePreset, setThemePreset } = useTheme();
  const { activeConversation: peer } = useSelectedConversation();
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

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

      {/* Header Actions */}
      <div className="flex items-center gap-1">
        {/* Typing Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium ${
            soundEnabled
              ? "bg-primary/10 border-primary/20 text-primary"
              : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground"
          }`}
          title={soundEnabled ? "Typing sounds enabled" : "Typing sounds disabled"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{soundEnabled ? "Sounds On" : "Muted"}</span>
        </button>

        {/* Theme Palette Preset Menu */}
        <div className="relative">
          <button
            onClick={() => setShowPresetsMenu((prev) => !prev)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition border border-transparent hover:border-border/40"
            title="Theme Palette"
          >
            <Palette className="w-4 h-4" />
          </button>

          {showPresetsMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 p-2 rounded-2xl bg-card border border-border shadow-xl z-50 grid grid-cols-2 gap-1 animate-in fade-in zoom-in-95 duration-150">
              {HERO_UI_THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setThemePreset(preset.id);
                    setShowPresetsMenu(false);
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-left transition ${
                    themePreset === preset.id
                      ? "bg-accent/20 text-accent font-semibold"
                      : "hover:bg-muted/40 text-foreground"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10"
                    style={{ background: preset.swatch }}
                  />
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
