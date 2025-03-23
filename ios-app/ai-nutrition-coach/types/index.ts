import { Audio } from "expo-av";
import { FadingLooper } from "../lib/FadingLooper";

export type User = {
  id: string;
  email: string;
  appleUserId?: string;
  subscription?: "free" | "premium";
  token?: any;
};

export type AudioFile = {
  id: string;
  fileUrl?: string;
  userPrompt?: string;
  volume?: number;
  createdAt?: string | Date;
  deletedAt?: string | Date;
};

export type AudioFileMixEntry = AudioFile & {
  volume: number;
};

export type Mix = {
  id: string;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  audioFiles: Array<AudioFileMixEntry>;
  isTemporary?: boolean;
};

export type iOSPlaybackStatusChangeCallback = (result: {
  status: "playing" | "paused" | "stopped";
}) => void;

export interface AudioManager {
  mixId?: string;
  files: Array<AudioFile>;
  audioObjects: Record<string, Audio.Sound | FadingLooper>;
  isOffline: boolean;
  addFile(file: AudioFile): Promise<void>;
  removeFile(file: AudioFile): Promise<void>;
  playFile(file: AudioFile): Promise<void>;
  stopFile(file: AudioFile): Promise<void>;
  toggleFile(file: AudioFile): Promise<void>;
  changeVolume(file: AudioFile, volume: number): Promise<void>;
  hasFile(file: AudioFile): boolean;
  playAllFiles(): Promise<void>;
  stopAllFiles(): Promise<void>;
  clearFiles(): Promise<void>;
  setMetadata(mixId: string, title: string): Promise<void>;
  audioTitle?: string;
  iOSPlaybackStatusChangeCallback?: (
    mixId: string,
    status: "playing" | "paused" | "stopped"
  ) => void;
  addNotificationAudioFile?(): Promise<void>;
}

export type SunData = {
  sunrise: string;
  sunset: string;
};

export type AppleLoginResponse = {
  user: string | null;
  identityToken: string | null;
  authorizationCode: string | null;
  email: string | null;
  familyName?: string | null;
  givenName?: string | null;
};
