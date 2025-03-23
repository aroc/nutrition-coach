import * as Crypto from "expo-crypto";
import { AudioFile, Mix, AudioFileMixEntry } from "@/types/index";
import Logger from "./Logger";
import { useAppStore } from "../state/store";
import db from "@/db/db";
import { mixes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stopPlayingMix } from "./audio-manager-utils";
import getAudioManagerInstance from "./AudioManagerSingleton";

export const deleteMix = async (mixId: Mix["id"]): Promise<boolean> => {
  if (!mixId) return false;
  const { nowPlayingMix, isPlaying, setNowPlayingMix } = useAppStore.getState();

  const thisMixIsNowPlaying = nowPlayingMix?.id === mixId;

  if (thisMixIsNowPlaying && isPlaying) {
    await stopPlayingMix();
  }

  // Delete from SQLite db
  try {
    await db.delete(mixes).where(eq(mixes.id, mixId));
    Logger.log("Deleted mix from local db", mixId);

    if (thisMixIsNowPlaying) {
      setNowPlayingMix(null);
    }

    return true;
  } catch (error) {
    Logger.error("Error deleting mix from local db:", error);
    throw error;
  }
};

export const updateMixAudioFile = async (
  mixId: Mix["id"],
  audioFileId: AudioFile["id"],
  updates: Partial<AudioFile>
) => {
  try {
    const { nowPlayingMix, setNowPlayingMix } = useAppStore.getState();
    const mix = await db.query.mixes.findFirst({
      where: eq(mixes.id, mixId),
    });

    if (!mix) throw new Error(`Mix not found with id ${mixId}`);

    const matchingAudioFile = mix.audioFiles.find(
      (audioFile) => audioFile.id === audioFileId
    );
    if (!matchingAudioFile)
      throw new Error(`Audio file not found with id ${audioFileId}`);

    const updatedAudioFiles = mix.audioFiles.map((audioFileItem) =>
      audioFileItem.id === audioFileId
        ? { ...audioFileItem, ...updates }
        : audioFileItem
    );

    await db
      .update(mixes)
      .set({ audioFiles: updatedAudioFiles })
      .where(eq(mixes.id, mixId));

    // if this mix is currently active, update the volume of the file
    // Only change the volume if it's the currently playing mix
    const audioManager = getAudioManagerInstance();

    if (audioManager && audioManager.mixId === mixId && updates.volume) {
      await audioManager.changeVolume(matchingAudioFile, updates.volume);
    }

    if (nowPlayingMix?.id === mixId) {
      // fetch the updated mix from the db
      const updatedMix = await db.query.mixes.findFirst({
        where: eq(mixes.id, mixId),
      });
      if (!updatedMix) throw new Error(`Mix not found with id ${mixId}`);
      setNowPlayingMix(updatedMix);
    }
  } catch (error) {
    Logger.error("Error updating mix audio file:", error);
    throw error;
  }
};

export const removeAudioFileFromMix = async (
  mixId: Mix["id"],
  audioFileId: AudioFile["id"]
) => {
  try {
    const { nowPlayingMix, setNowPlayingMix } = useAppStore.getState();

    const mix = await db.query.mixes.findFirst({
      where: eq(mixes.id, mixId),
    });

    if (!mix) throw new Error(`Mix not found with id ${mixId}`);

    const matchedAudioFile = mix.audioFiles.find(
      (audioFile) => audioFile.id === audioFileId
    );

    if (!matchedAudioFile)
      throw new Error(`Audio file not found with id ${audioFileId}`);

    const updatedAudioFiles = mix.audioFiles.filter(
      (audioFile) => audioFile.id !== audioFileId
    );

    await db
      .update(mixes)
      .set({ audioFiles: updatedAudioFiles })
      .where(eq(mixes.id, mixId));

    // Stop playing the removed audio file if it's currently playing
    const audioManager = getAudioManagerInstance();
    if (audioManager && audioManager.mixId === mixId) {
      await audioManager.stopFile(matchedAudioFile);
      await audioManager.removeFile(matchedAudioFile);
    }

    if (nowPlayingMix?.id === mixId) {
      // fetch the updated mix from the db
      const updatedMix = await db.query.mixes.findFirst({
        where: eq(mixes.id, mixId),
      });
      if (!updatedMix) throw new Error(`Mix not found with id ${mixId}`);
      setNowPlayingMix(updatedMix);
    }
  } catch (error) {
    Logger.error("Error removing audio file from mix:", error);
    throw error;
  }
};

export const addAudioFileToMix = async (
  mixId: Mix["id"],
  audioFile: AudioFile,
  volume: number = 1
): Promise<Mix | undefined> => {
  try {
    const { nowPlayingMix, isPlaying } = useAppStore.getState();

    const mix = await db.query.mixes.findFirst({
      where: eq(mixes.id, mixId),
    });

    if (!mix) throw new Error(`Mix not found with id ${mixId}`);

    const audioFileEntry: AudioFileMixEntry = {
      ...audioFile,
      volume,
    };

    const updatedAudioFiles = [...mix.audioFiles, audioFileEntry];

    await db
      .update(mixes)
      .set({ audioFiles: updatedAudioFiles })
      .where(eq(mixes.id, mixId));

    // if the now playuing mix is the one we just updated, update audio manager
    if (nowPlayingMix?.id === mixId) {
      const audioManager = getAudioManagerInstance();

      if (isPlaying) {
        // will also add the file to the audio manager
        await audioManager.playFile(audioFileEntry);
      } else {
        await audioManager.addFile(audioFileEntry);
      }
    }

    // fetch the updated mix from the db
    const updatedMix = await db.query.mixes.findFirst({
      where: eq(mixes.id, mixId),
    });

    if (!updatedMix) throw new Error(`Mix not found with id ${mixId}`);

    return updatedMix;
  } catch (error) {
    Logger.error("Error adding audio file to mix:", error);
    throw error;
  }
};

export const createMix = async ({
  name,
  audioFiles,
  isTemporary = false,
  setMixAsNowPlayingAfterCreate = false,
}: {
  name: string;
  audioFiles: AudioFileMixEntry[];
  isTemporary?: boolean;
  setMixAsNowPlayingAfterCreate?: boolean;
}): Promise<Mix | undefined> => {
  try {
    const { setNowPlayingMix } = useAppStore.getState();

    const newMixInsertValues = {
      id: Crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      audioFiles,
      isTemporary,
    };

    await db.insert(mixes).values(newMixInsertValues);

    const newMix = await db.query.mixes.findFirst({
      where: eq(mixes.id, newMixInsertValues.id),
    });

    if (!newMix) throw new Error("Failed to create mix");

    if (setMixAsNowPlayingAfterCreate) {
      setNowPlayingMix(newMix);
    }

    return newMix;
  } catch (error) {
    Logger.error("Error creating mix:", error);
    throw error;
  }
};

export const updateMix = async (
  mixId: string,
  { name, isTemporary }: { name?: string; isTemporary?: boolean }
): Promise<Mix | undefined> => {
  try {
    await db
      .update(mixes)
      .set({
        name,
        isTemporary,
        updatedAt: new Date(),
      })
      .where(eq(mixes.id, mixId));

    const updatedMix = await db.query.mixes.findFirst({
      where: eq(mixes.id, mixId),
    });

    if (!updatedMix) throw new Error(`Mix not found with id ${mixId}`);

    return updatedMix;
  } catch (error) {
    Logger.error("Error updating mix:", error);
    throw error;
  }
};
