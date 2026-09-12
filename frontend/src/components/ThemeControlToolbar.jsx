import { useState } from "react";
import { Sun, Moon, Volume2, VolumeX, Palette, Check } from "lucide-react";
import { useTheme, applyThemePresetToDocument } from "../context/theme";
import { HERO_UI_THEME_PRESETS } from "../data/heroutheampresets";
import { useSoundStore } from "../store/useSoundStore";

export function ThemeControlToolbar({ compact = false }) {
  const { theme, setTheme, themePreset, setThemePreset } = useTheme();
  const { soundEnabled, toggleSound, soundProfile, setSoundProfile, playKeystrokeSound } =
    useSoundStore();

  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);

  const toggleThemeMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSelectPreset = (id) => {
    applyThemePresetToDocument(id);
    setThemePreset(id);
    setIsPresetOpen(false);
  };

  const soundProfiles = [
    { id: "mechanical", label: "Mechanical Switch" },
    { id: "bubble", label: "Soft Bubble Pop" },
    { id: "minimal", label: "Crisp Minimal" },
    { id: "off", label: "Muted / Off" },
  ];

  return (
    <div
      className={`relative z-30 inline-flex items-center gap-1.5 ${
        compact ? "p-0.5" : "p-1"
      } rounded-2xl bg-card/90 backdrop-blur-md border border-border/60 shadow-lg text-foreground transition-all`}
    >
      {/* Light / Dark Mode Toggle */}
      <button
        type="button"
        onClick={toggleThemeMode}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="relative flex items-center justify-center size-8 rounded-xl hover:bg-muted/80 active:scale-95 transition text-foreground cursor-pointer"
      >
        {theme === "dark" ? (
          <Sun className="size-4 text-amber-400 animate-spin-slow" />
        ) : (
          <Moon className="size-4 text-indigo-500" />
        )}
      </button>

      {/* Preset Palette Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsPresetOpen((prev) => !prev);
            setIsSoundMenuOpen(false);
          }}
          title="Change theme color preset"
          className="relative flex items-center justify-center size-8 rounded-xl hover:bg-muted/80 active:scale-95 transition text-foreground cursor-pointer"
        >
          <Palette className="size-4 text-primary" />
        </button>

        {/* Preset Selector Popover */}
        {isPresetOpen && (
          <>
            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setIsPresetOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-[100] w-72 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Theme Preset
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {HERO_UI_THEME_PRESETS.find((p) => p.id === themePreset)?.label || "Default"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1">
                {HERO_UI_THEME_PRESETS.map((p) => {
                  const isSelected = themePreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p.id)}
                      className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition cursor-pointer ${
                        isSelected
                          ? "bg-primary/15 ring-2 ring-primary ring-offset-1 ring-offset-card"
                          : "hover:bg-muted/60"
                      }`}
                    >
                      <span
                        className="relative size-7 rounded-full shadow-inner ring-1 ring-white/20 transition group-hover:scale-105"
                        style={{ background: p.swatch }}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                            <Check className="size-3.5 stroke-[3]" />
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground truncate w-full text-center">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sound Toggle & Profile Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsSoundMenuOpen((prev) => !prev);
            setIsPresetOpen(false);
          }}
          title="Keystroke Audio Settings"
          className={`relative flex items-center justify-center size-8 rounded-xl hover:bg-muted/80 active:scale-95 transition cursor-pointer ${
            soundEnabled && soundProfile !== "off" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {soundEnabled && soundProfile !== "off" ? (
            <Volume2 className="size-4" />
          ) : (
            <VolumeX className="size-4" />
          )}
        </button>

        {/* Sound Selector Popover */}
        {isSoundMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setIsSoundMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-[100] w-56 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Keystroke Sound
                </span>
                <button
                  type="button"
                  onClick={() => toggleSound()}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition cursor-pointer ${
                    soundEnabled && soundProfile !== "off"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {soundEnabled && soundProfile !== "off" ? "Enabled" : "Muted"}
                </button>
              </div>

              <div className="space-y-1">
                {soundProfiles.map((p) => {
                  const isSelected =
                    p.id === "off"
                      ? !soundEnabled || soundProfile === "off"
                      : soundEnabled && soundProfile === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (p.id === "off") {
                          toggleSound();
                          setSoundProfile("off");
                        } else {
                          setSoundProfile(p.id);
                          setTimeout(() => playKeystrokeSound(), 50);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span>{p.label}</span>
                      {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default ThemeControlToolbar;
