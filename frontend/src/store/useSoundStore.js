import { create } from "zustand";

const SOUND_FILES = [
  "/sounds/keystroke1.mp3",
  "/sounds/keystroke2.mp3",
  "/sounds/keystroke3.mp3",
  "/sounds/keystroke4.mp3",
  "/sounds/keystore6.mp3",
  "/sounds/keystroke7.mp3",
];

// Preload audio elements
const audioPool = SOUND_FILES.map((src) => {
  if (typeof window !== "undefined") {
    const audio = new Audio(src);
    audio.volume = 0.35;
    return audio;
  }
  return null;
});

let soundIndex = 0;
let lastPlayedTime = 0;
const THROTTLE_MS = 60;

export const useSoundStore = create((set, get) => ({
  soundEnabled: (() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("typingSoundEnabled");
    return stored === null ? true : stored === "true";
  })(),

  toggleSound: () => {
    const nextState = !get().soundEnabled;
    set({ soundEnabled: nextState });
    if (typeof window !== "undefined") {
      localStorage.setItem("typingSoundEnabled", String(nextState));
    }
  },

  playKeystroke: () => {
    if (!get().soundEnabled) return;

    const now = Date.now();
    if (now - lastPlayedTime < THROTTLE_MS) return;
    lastPlayedTime = now;

    try {
      const audio = audioPool[soundIndex % audioPool.length];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Ignore autoplay restriction errors if user hasn't interacted yet
        });
      }
      soundIndex++;
    } catch {
      // Ignore audio errors gracefully
    }
  },
}));
