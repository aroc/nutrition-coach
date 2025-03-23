import * as Crypto from "expo-crypto";
import { Mix, AudioFile, AudioFileMixEntry } from "../types";
import Logger from "./Logger";
import { useAppStore } from "../state/store";
import getAudioManagerInstance from "./AudioManagerSingleton";
import iOSAudioManager from "./iOSAudioManager";
import { getAudioFilesFromCacheOrDownload } from "./iOSAudioFileUtils";
import { eq } from "drizzle-orm";
import db from "@/db/db";
import { mixes } from "@/db/schema";

const addFilesToManager = async (mix: Mix) => {
  for (const file of mix.audioFiles) {
    await getAudioManagerInstance().addFile(file);
  }
};

export const setMixAsNowPlaying = async (mix: Mix) => {
  const {
    nowPlayingMix,
    setNowPlayingMix,
    isOffline,
    setAudioFileBeingDownloaded,
    removeAudioFilesBeingDownloaded,
  } = useAppStore.getState();

  if (nowPlayingMix?.id !== mix.id) {
    setNowPlayingMix(mix);
  }

  const audioManager = getAudioManagerInstance();
  if (audioManager.mixId !== mix.id) {
    // If the manager is for a different mix, clear existing files from manager
    // and prepare manager for the new mix
    Logger.log(
      "Clearing audio manager files in preparing to play a different mix"
    );

    // Ensure file are all downloaded first
    if (!isOffline) {
      await getAudioFilesFromCacheOrDownload(
        mix.audioFiles,
        setAudioFileBeingDownloaded,
        removeAudioFilesBeingDownloaded
      );
    }

    await audioManager.clearFiles();
    await audioManager.setMetadata(mix.id, mix.name);
    audioManager.isOffline = isOffline;
    await addFilesToManager(mix);
  }
};

export const clearNowPlayingMix = async () => {
  const { setNowPlayingMix, setIsPlaying } = useAppStore.getState();
  setIsPlaying(false);
  setNowPlayingMix(null);
  const audioManager = getAudioManagerInstance();
  await audioManager.clearFiles();
  await audioManager.setMetadata("", "");
};

type PlayMixOptions = {
  forcePlay?: boolean;
};

export const playMix = async (
  mix: Mix,
  { forcePlay = false }: PlayMixOptions = {}
) => {
  const { setIsPlaying, isPlaying } = useAppStore.getState();

  Logger.log("Playing mix", mix.id);

  const audioManager = getAudioManagerInstance();

  if (audioManager.mixId === mix.id && isPlaying && !forcePlay) {
    Logger.log("Mix is already playing");
    return;
  }

  // It's a different mix, so stop whatever mix is currently playing
  if (audioManager.mixId !== mix.id && isPlaying) {
    await stopPlayingMix();
  }

  if (
    audioManager instanceof iOSAudioManager &&
    !audioManager.playbackStatusChangeCallback
  ) {
    (audioManager as iOSAudioManager).playbackStatusChangeCallback =
      handlePlaybackStatusChange;
  }

  await setMixAsNowPlaying(mix);
  setIsPlaying(true);

  await audioManager.playAllFiles();
};

export const handlePlaybackStatusChange = async (result: {
  status: "playing" | "paused" | "stopped";
}) => {
  // const { getMix } = useAppStore.getState();
  const { status } = result;
  Logger.log("playback status changed", status);

  const audioManager = getAudioManagerInstance();

  if (status === "stopped" || status === "paused") {
    await stopPlayingMix();
  } else if (status === "playing") {
    if (!audioManager?.mixId) return;

    // const mix = getMix(audioManager.mixId);
    const mix = await db.query.mixes.findFirst({
      where: eq(mixes.id, audioManager.mixId),
    });

    if (!mix) {
      Logger.error(
        `Can't play mix ${audioManager.mixId} because it doesn't exist`
      );
      return;
    }

    Logger.log("Playing mix due to playback status change", mix.id);
    playMix(mix);
  }
};

export const stopPlayingMix = async () => {
  await getAudioManagerInstance().stopAllFiles();
  useAppStore.getState().stopPlayingMix();
};

export const togglePlayingMix = async (mix: Mix) => {
  const { nowPlayingMix, isPlaying } = useAppStore.getState();

  if (nowPlayingMix?.id !== mix.id || !isPlaying) {
    await playMix(mix);
  } else {
    await stopPlayingMix();
  }
};

export const playAudioFile = async (file: AudioFile) => {
  const audioManager = getAudioManagerInstance();

  if (
    audioManager instanceof iOSAudioManager &&
    !audioManager.playbackStatusChangeCallback
  ) {
    (audioManager as iOSAudioManager).playbackStatusChangeCallback =
      handlePlaybackStatusChange;
  }

  await audioManager.playFile(file);
};

export const addAudioFileToMixAndPlay = async (file: AudioFile) => {
  const audioManager = getAudioManagerInstance();
  await audioManager.addFile(file);
  await audioManager.playFile(file);
};

export const stopAudioFile = async (file: AudioFile) => {
  const audioManager = getAudioManagerInstance();

  if (
    audioManager instanceof iOSAudioManager &&
    !audioManager.playbackStatusChangeCallback
  ) {
    (audioManager as iOSAudioManager).playbackStatusChangeCallback =
      handlePlaybackStatusChange;
  }

  await audioManager.stopFile(file);
};

export const stopAudioFileAndRemoveFromMix = async (file: AudioFile) => {
  const audioManager = getAudioManagerInstance();
  await audioManager.stopFile(file);
  await audioManager.removeFile(file);
};

export const toggleAudioFile = async (file: AudioFile) => {
  const audioManager = getAudioManagerInstance();

  if (
    audioManager instanceof iOSAudioManager &&
    !audioManager.playbackStatusChangeCallback
  ) {
    (audioManager as iOSAudioManager).playbackStatusChangeCallback =
      handlePlaybackStatusChange;
  }

  await audioManager.toggleFile(file);
};
