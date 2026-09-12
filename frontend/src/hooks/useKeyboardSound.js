import { useCallback } from "react";
import { useSoundStore } from "../store/useSoundStore";

export function useKeyboardSound() {
  const playKeystrokeSound = useSoundStore((state) => state.playKeystrokeSound);
  const soundEnabled = useSoundStore((state) => state.soundEnabled);

  const handleKeyDown = useCallback(
    (e) => {
      // Don't play for standalone modifier keys
      if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) {
        return;
      }
      playKeystrokeSound();
    },
    [playKeystrokeSound]
  );

  return {
    handleKeyDown,
    playKeystrokeSound,
    soundEnabled,
  };
}
