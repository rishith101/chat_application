import { useTheme } from "../context/themecontext";
import { useSoundStore } from "../store/useSoundStore";
import { HERO_UI_THEME_PRESETS } from "../data/heroutheampresets";
import { Button, ButtonGroup, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Sun, Moon, Volume2, VolumeX, Palette, Check } from "lucide-react";
import { useState } from "react";

export function ThemeControlToolbar({ compact = false }) {
  const { theme, setTheme, themePreset, setThemePreset } = useTheme();
  const { soundEnabled, toggleSound } = useSoundStore();
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-950/90 border border-slate-800/80 backdrop-blur-xl shadow-lg ring-1 ring-white/10 text-slate-100">
      {/* CONTROL 1 — APPEARANCE / ACCENT PRESETS */}
      <Popover isOpen={popoverOpen} onOpenChange={setPopoverOpen} placement="bottom-end">
        <PopoverTrigger>
          <Button
            isIconOnly
            size="sm"
            className={`h-7 w-7 min-w-7 rounded-full border transition-all duration-200 flex items-center justify-center ${
              popoverOpen
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-slate-900/80 border-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
            aria-label="Appearance Presets"
            title="Appearance Presets"
          >
            <Palette className="w-3.5 h-3.5 text-accent" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-2 w-56 rounded-2xl bg-slate-950/95 border border-slate-800 text-slate-100 shadow-2xl backdrop-blur-2xl z-50">
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1.5">
            Accent Color Presets
          </div>
          <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1">
            {HERO_UI_THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setThemePreset(preset.id);
                  setPopoverOpen(false);
                }}
                className={`flex items-center justify-between p-1.5 rounded-xl text-xs font-medium text-left transition ${
                  themePreset === preset.id
                    ? "bg-primary/20 text-primary font-bold border border-primary/30"
                    : "hover:bg-slate-800/60 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/20 shadow-xs"
                    style={{ background: preset.swatch }}
                  />
                  <span className="truncate text-[11px]">{preset.label}</span>
                </div>
                {themePreset === preset.id && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* VERTICAL SEPARATOR */}
      <div className="w-px h-3.5 bg-slate-800/90 my-auto" />

      {/* CONTROL 2 — LIGHT / DARK MODE */}
      <ButtonGroup size="sm" className="bg-slate-900/90 p-0.5 rounded-full border border-slate-800/80">
        <Button
          isIconOnly
          size="sm"
          onClick={() => setTheme("light")}
          className={`h-6 w-6 min-w-6 rounded-full transition-all duration-200 ${
            theme === "light"
              ? "bg-white text-slate-950 shadow-xs font-bold"
              : "bg-transparent text-slate-400 hover:text-white"
          }`}
          aria-label="Light Mode"
          title="Light Mode"
        >
          <Sun className="w-3 h-3" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          onClick={() => setTheme("dark")}
          className={`h-6 w-6 min-w-6 rounded-full transition-all duration-200 ${
            theme === "dark"
              ? "bg-slate-800 text-white shadow-xs font-bold"
              : "bg-transparent text-slate-400 hover:text-white"
          }`}
          aria-label="Dark Mode"
          title="Dark Mode"
        >
          <Moon className="w-3 h-3" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default ThemeControlToolbar;
