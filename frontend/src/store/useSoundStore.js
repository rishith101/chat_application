import { create } from "zustand";

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
  }

  getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playKeystroke(soundType = "mechanical", volume = 0.5) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    if (soundType === "bubble") {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const startFreq = 400 + Math.random() * 200;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.8, now + 0.04);

      gainNode.gain.setValueAtTime(volume * 0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (soundType === "minimal") {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      const freq = 600 + Math.random() * 150;
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(volume * 0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.03);
    } else {
      // Mechanical switch click
      const bufferSize = ctx.sampleRate * 0.025;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800 + Math.random() * 600;
      filter.Q.value = 3.5;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.03);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(volume * 0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noise.connect(filter);
      filter.connect(gainNode);
      osc.connect(oscGain);
      oscGain.connect(gainNode);

      gainNode.gain.setValueAtTime(volume * 0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.035);
      osc.stop(now + 0.035);
    }
  }

  playNotification(volume = 0.5) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(volume * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880.0, now + 0.12); // A5

    osc1.connect(gainNode);
    osc1.start(now);
    osc1.stop(now + 0.4);
  }

  playSent(volume = 0.5) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(volume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

const synth = new SoundSynthesizer();

const initialSoundEnabled =
  typeof window !== "undefined"
    ? localStorage.getItem("vibe_sound_enabled") !== "false"
    : true;

const initialSoundProfile =
  typeof window !== "undefined"
    ? localStorage.getItem("vibe_sound_profile") || "mechanical"
    : "mechanical";

export const useSoundStore = create((set, get) => ({
  soundEnabled: initialSoundEnabled,
  soundProfile: initialSoundProfile, // "mechanical" | "bubble" | "minimal" | "off"
  volume: 0.6,

  toggleSound: () => {
    const next = !get().soundEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("vibe_sound_enabled", String(next));
    }
    set({ soundEnabled: next });
    if (next) {
      get().playKeystrokeSound();
    }
  },

  setSoundEnabled: (enabled) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vibe_sound_enabled", String(enabled));
    }
    set({ soundEnabled: enabled });
  },

  setSoundProfile: (profile) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vibe_sound_profile", profile);
    }
    set({ soundProfile: profile, soundEnabled: profile !== "off" });
  },

  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  playKeystrokeSound: () => {
    const { soundEnabled, soundProfile, volume } = get();
    if (!soundEnabled || soundProfile === "off") return;
    synth.playKeystroke(soundProfile, volume);
  },

  playNotificationSound: () => {
    const { soundEnabled, volume } = get();
    if (!soundEnabled) return;
    synth.playNotification(volume);
  },

  playSentSound: () => {
    const { soundEnabled, volume } = get();
    if (!soundEnabled) return;
    synth.playSent(volume);
  },
}));
