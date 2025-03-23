import {
  AVPlaybackStatus,
  AVPlaybackStatusError,
  AVPlaybackStatusSuccess,
  Audio,
} from "expo-av";
import { Platform } from "react-native";
import Logger from "./Logger";

const FADE_DURATION = 2000;

const isPlaybackStatusSuccess = (
  s: AVPlaybackStatus
): s is AVPlaybackStatusSuccess => {
  return (s as AVPlaybackStatusError)?.error === undefined;
};

export class FadingLooper {
  source: number | string;
  sound1: Audio.Sound;
  sound2: Audio.Sound;
  isInitialized: boolean;
  isCurrentlyPlaying: boolean;
  isFading: boolean;
  soundIsPlaying: "sound1" | "sound2";
  volume: number;

  private fadeOutPromise: Promise<void> | null = null;
  private lastAction: "play" | "pause" | null = null;
  private actionTimestamp: number = 0;

  constructor(source: number | string, volume: number) {
    this.source = source;
    this.sound1 = new Audio.Sound();
    this.sound2 = new Audio.Sound();
    this.isInitialized = false;
    this.isCurrentlyPlaying = false;
    this.isFading = false;
    this.soundIsPlaying = "sound1";
    // round to 1 decimal places
    this.volume = Math.round(volume * 10) / 10;
  }

  async init() {
    try {
      // For local assets (number) use loadAsync directly
      // For URI strings, wrap in an object with uri property
      const sourceObj =
        typeof this.source === "string" ? { uri: this.source } : this.source;

      await this.sound1.loadAsync(sourceObj);
      await this.sound2.loadAsync(sourceObj);
      await this.sound1.setProgressUpdateIntervalAsync(200);
      await this.sound2.setProgressUpdateIntervalAsync(200);
      await this.sound1.setVolumeAsync(this.volume);
      await this.sound2.setVolumeAsync(this.volume);

      this.sound1.setOnPlaybackStatusUpdate(
        this.handlePlaybackStatusUpdate.bind(
          this,
          this.sound1,
          this.sound2,
          "sound1"
        )
      );
      this.sound2.setOnPlaybackStatusUpdate(
        this.handlePlaybackStatusUpdate.bind(
          this,
          this.sound2,
          this.sound1,
          "sound2"
        )
      );

      this.isInitialized = true;
    } catch (error) {
      console.warn("FadingLooper init error:", error);
    }
  }

  play = async () => {
    try {
      const now = Date.now();

      // Prevent multiple simultaneous play attempts
      if (
        this.lastAction === "play" &&
        Date.now() - this.actionTimestamp < 1000
      ) {
        return;
      }

      this.lastAction = "play";
      this.actionTimestamp = now;

      if (!this.isInitialized) {
        await this.init();
      }

      // Reset the sound state if needed
      const status = await this[this.soundIsPlaying].getStatusAsync();
      if (isPlaybackStatusSuccess(status)) {
        if (status.isPlaying) {
          this.isCurrentlyPlaying = true;
          return;
        }

        // Reset position if we're at the end
        if (status.positionMillis >= (status.durationMillis || 0)) {
          await this[this.soundIsPlaying].setPositionAsync(0);
        }
      }

      if (this.fadeOutPromise) {
        await this.fadeOutPromise;
      }

      // Double check we still want to play
      if (this.lastAction !== "play" || this.actionTimestamp !== now) {
        return;
      }

      await this[this.soundIsPlaying].setVolumeAsync(this.volume);
      await this[this.soundIsPlaying].playAsync();
      this.isCurrentlyPlaying = true;
    } catch (error) {
      // Reset state on error
      this.isCurrentlyPlaying = false;
    }
  };

  // Debounce volume changes
  private volumeChangeTimerId: NodeJS.Timeout | null = null;
  private pendingVolumeValue: number | null = null;

  setVolume = async (volume: number) => {
    try {
      // Store the target volume immediately
      this.volume = volume;
      this.pendingVolumeValue = volume;

      // Clear any existing timer
      if (this.volumeChangeTimerId) {
        clearTimeout(this.volumeChangeTimerId);
      }

      // Set a short delay to apply volume changes
      this.volumeChangeTimerId = setTimeout(async () => {
        try {
          // Only apply if we're not in the middle of a fade
          if (this.isFading) return;

          const status = await this[this.soundIsPlaying].getStatusAsync();
          if (!isPlaybackStatusSuccess(status) || !status.isLoaded) return;

          // Apply volume changes in parallel to both sounds
          await Promise.all([
            this.sound1.setVolumeAsync(this.pendingVolumeValue!),
            this.sound2.setVolumeAsync(this.pendingVolumeValue!),
          ]);

          this.pendingVolumeValue = null;
          this.volumeChangeTimerId = null;
        } catch (error) {
          Logger.warn("Delayed volume update error:", error);
        }
      }, 50); // 50ms delay should feel responsive while preventing constant updates
    } catch (error) {
      Logger.warn("FadingLooper setVolume error:", error);
    }
  };

  pause = async (options?: { fadeOut?: boolean }) => {
    try {
      const now = Date.now();

      // Prevent multiple simultaneous pause attempts
      if (
        this.lastAction === "pause" &&
        Date.now() - this.actionTimestamp < 1000
      ) {
        return;
      }

      this.lastAction = "pause";
      this.actionTimestamp = now;

      const status = await this[this.soundIsPlaying].getStatusAsync();
      if (!isPlaybackStatusSuccess(status) || !status.isPlaying) {
        this.isCurrentlyPlaying = false;
        return;
      }

      this.isCurrentlyPlaying = false;

      if (options?.fadeOut !== true) {
        await this[this.soundIsPlaying].setVolumeAsync(0);
        await this[this.soundIsPlaying].pauseAsync();
        this.fadeOutPromise = null;
        return;
      }

      this.fadeOutPromise = this.fadeOutAndPause(
        this[this.soundIsPlaying],
        now
      );
      await this.fadeOutPromise;
      this.fadeOutPromise = null;
    } catch (error) {
      Logger.warn("FadingLooper pause error:", error);
    }
  };

  fadeOutAndPause = async (sound: Audio.Sound, timestamp: number) => {
    try {
      if (Platform.OS === "android") {
        await sound.setVolumeAsync(0);
        await sound.pauseAsync();
        return;
      }

      const fadeSteps = 20; // Increased for smoother transition
      const stepDuration = FADE_DURATION / fadeSteps;
      const startVolume = this.volume;

      // Calculate volume reduction per step
      const volumeStep = startVolume / fadeSteps;

      for (let i = fadeSteps; i >= 0; i--) {
        // Check if a new action was requested
        if (this.actionTimestamp !== timestamp) {
          return;
        }

        const newVolume = volumeStep * i;
        await sound.setVolumeAsync(newVolume);
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }

      // Final pause
      if (this.actionTimestamp === timestamp) {
        await sound.pauseAsync();
      }
    } catch (error) {
      Logger.warn("FadingLooper fadeOutAndPause error:", error);
    }
  };

  destroy = async () => {
    try {
      this.sound1.unloadAsync();
      this.sound2.unloadAsync();
    } catch (error) {
      Logger.warn("FadingLooper destroy error:", error);
    }
  };

  fade = async ({
    name,
    sound,
    fromVolume,
    toVolume,
  }: {
    name: "sound1" | "sound2";
    sound: Audio.Sound;
    fromVolume: number;
    toVolume: number;
  }) => {
    try {
      if (Platform.OS === "android") {
        if (fromVolume > toVolume) {
          await sound.setVolumeAsync(0);
          await sound.stopAsync();
        } else {
          await sound.setVolumeAsync(toVolume);
        }
        return;
      }

      const fadeSteps = 10;
      const stepDuration = FADE_DURATION / fadeSteps;
      const volumeDiff = toVolume - fromVolume;
      const volumeStep = volumeDiff / fadeSteps;

      for (let i = 0; i <= fadeSteps; i++) {
        const newVolume = fromVolume + volumeStep * i;
        try {
          await sound.setVolumeAsync(newVolume);
          await new Promise((resolve) => setTimeout(resolve, stepDuration));
        } catch (e) {
          Logger.error("Error when fading for", name, newVolume, toVolume, e);
        }
      }

      if (toVolume === 0) {
        await sound.stopAsync();
      }
    } catch (error) {
      Logger.warn("FadingLooper fade error:", error);
    }
  };

  handlePlaybackStatusUpdate = async (
    currentSound: Audio.Sound,
    nextSound: Audio.Sound,
    soundName: "sound1" | "sound2",
    status: AVPlaybackStatus
  ) => {
    if (!isPlaybackStatusSuccess(status) || !this.isCurrentlyPlaying) {
      return;
    }

    if (!status.durationMillis) {
      return;
    }

    if (
      status.positionMillis > status.durationMillis - FADE_DURATION &&
      !this.isFading
    ) {
      this.isFading = true;

      const nextSoundName = soundName === "sound1" ? "sound2" : "sound1";
      this.soundIsPlaying = nextSoundName;

      try {
        await Promise.all([
          this.fade({
            name: soundName,
            sound: currentSound,
            fromVolume: this.volume,
            toVolume: 0,
          }),
          (async () => {
            await nextSound.setVolumeAsync(0);
            await nextSound.setPositionAsync(0);
            await nextSound.playAsync();
            return this.fade({
              name: nextSoundName,
              sound: nextSound,
              fromVolume: 0,
              toVolume: this.volume,
            });
          })(),
        ]);

        this.isFading = false;
      } catch (error) {
        console.error("Fade error:", error);
        this.isFading = false;
      }
    }
  };
}
