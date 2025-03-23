import {
  AudioFile,
  AudioManager,
  iOSPlaybackStatusChangeCallback,
} from "../types";
import Logger from "../lib/Logger";
import {
  getAudioFileFromCacheOrDownload,
  audioFileIsInCache,
} from "./iOSAudioFileUtils";
import { Audio, InterruptionModeIOS } from "expo-av";
import { FadingLooper } from "./FadingLooper";

const SILENT_WAV_FILE_ID = "silent-wave-file-id-123456";
const SILENT_WAV_AUDIO_FILE: {
  id: string;
  fileUrl: string;
  volume: number;
} = {
  id: SILENT_WAV_FILE_ID,
  fileUrl: "assets/audio_files/silent_1s.wav",
  volume: 0.1,
};

const SILENT_WAV_FILE_SOURCE = require("../assets/audio/silent_1s.wav");

class iOSAudioManager implements AudioManager {
  files: Array<AudioFile>;

  audioTitle?: string;

  mixId?: string;

  isNotificationFileAdded: boolean = false;

  isOffline: boolean;

  playbackStatusChangeCallback?: iOSPlaybackStatusChangeCallback;

  audioObjects: Record<string, FadingLooper> = {};

  constructor({
    audioTitle,
    mixId,
    playbackStatusChangeCallback,
  }: {
    audioTitle?: string;
    mixId?: string;
    playbackStatusChangeCallback?: iOSPlaybackStatusChangeCallback;
  }) {
    this.audioTitle = audioTitle ?? "Smooth Noise";
    this.files = [];
    this.audioObjects = {};
    this.playbackStatusChangeCallback = playbackStatusChangeCallback;
    this.mixId = mixId;
    this.isOffline = false;
  }

  addOnPlaybackStatusChange() {
    if (
      !this.files.length ||
      this.files.length > 1 ||
      !this.playbackStatusChangeCallback
    ) {
      return;
    }

    // AudioPlayer.onPlaybackStatusChange({
    //   audioId: SILENT_WAV_FILE_ID,
    // }, this.playbackStatusChangeCallback);
  }

  async addNotificationAudioFile() {
    // Just to be sure, set this
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    });

    // add a 1s silent wav file to the audio player and loop it so we can use it for the notification
    // only add it once
    if (this.isNotificationFileAdded) {
      return;
    }

    try {
      // const silentWaveFileURI = Capacitor.convertFileSrc(silentWavAudioFile.fileUrl as string);

      if (!this.audioTitle) {
        throw new Error("No audio title provided");
      }

      Logger.log(
        `Adding silent wav file for notification and using title ${this.audioTitle}`
      );

      const silentWavAudioObject = new FadingLooper(SILENT_WAV_FILE_SOURCE, 0);
      await silentWavAudioObject.init();
      this.audioObjects[SILENT_WAV_FILE_ID] = silentWavAudioObject;

      // TODO: Set up the ios notification for the lock screen

      // await AudioPlayer.create({
      //   audioId: SILENT_WAV_FILE_ID,
      //   audioSource: silentWaveFileURI,
      //   friendlyTitle: this.audioTitle,
      //   useForNotification: true,
      //   isBackgroundMusic: false,
      //   loop: true,
      // });

      // await AudioPlayer.initialize({
      //   audioId: SILENT_WAV_FILE_ID,
      // });

      this.isNotificationFileAdded = true;
    } catch (error) {
      Logger.error("Error adding notification audio file:", String(error));
    }
  }

  async addFile(file: AudioFile) {
    if (file.id === SILENT_WAV_FILE_ID) {
      return;
    }

    await this.addNotificationAudioFile();

    if (this.files.find((f) => f.id === file.id)) {
      Logger.log("File already added. Skipping adding of file.");
      return;
    }

    try {
      const fileIsInCache = await audioFileIsInCache(file.fileUrl ?? "");

      if (this.isOffline && !fileIsInCache) {
        Logger.log(
          "File is not in cache and is offline. Skipping adding of file."
        );
        return;
      }

      this.files.push(file);

      // const fileFullURL = `${import.meta.env.VITE_S3_BASE_URL}${file.fileUrl}`;
      const fileFullURL = `${process.env.EXPO_PUBLIC_S3_BASE_URL}${file.fileUrl}`;
      Logger.log("Adding file", fileFullURL);

      let filePath = await getAudioFileFromCacheOrDownload(fileFullURL);
      if (!filePath) {
        throw new Error("Failed to get audio file from cache or download");
      }

      Logger.log("Adding local file", filePath);

      const audioObject = new FadingLooper(filePath, file.volume ?? 1);
      await audioObject.init();
      this.audioObjects[file.id] = audioObject;

      // await AudioPlayer.create({
      //   audioId: file.id,
      //   audioSource: filePath,
      //   friendlyTitle: this.audioTitle ?? "Smooth Noise", // Not used for notification
      //   useForNotification: false,
      //   isBackgroundMusic: true,
      //   loop: true,
      // });

      this.addOnPlaybackStatusChange();

      // await AudioPlayer.initialize({
      //   audioId: file.id,
      // });

      await audioObject.setVolume(file.volume ?? 1);

      // await this.changeVolume(file, file.volume ?? 1);
    } catch (error) {
      Logger.error("Error adding file", error);
      throw error;
    }
  }

  async removeFile(file: AudioFile) {
    try {
      this.files = this.files.filter((f) => f.id !== file.id);
      const audioObject = this.audioObjects[file.id];

      if (audioObject) {
        await audioObject.pause();
        await audioObject.destroy();
        delete this.audioObjects[file.id];
      }
    } catch (error) {
      Logger.error("Error removing file", error);
    }
  }

  async playFile(file: AudioFile) {
    try {
      if (file.id !== SILENT_WAV_FILE_ID) {
        await this.addFile(file);
      }

      const audioObject = this.audioObjects[file.id];

      if (!audioObject) {
        throw new Error(`Audio object with id ${file.id} not found`);
      }

      if (audioObject) {
        Logger.log("Playing audio object for file", file.id);
        await audioObject.play();
      }
    } catch (error) {
      Logger.error("Error playing file", error);
    }
  }

  async stopFile(file: AudioFile) {
    try {
      const audioObject = this.audioObjects[file.id];
      if (audioObject) {
        await audioObject.pause();
      }
    } catch (error) {
      Logger.error("Error stopping file", error);
    }
  }

  async toggleFile(file: AudioFile) {
    try {
      const audioObject = this.audioObjects[file.id];

      if (!audioObject) {
        throw new Error(`Audio object with id ${file.id} not found`);
      }

      if (audioObject) {
        if (audioObject.isCurrentlyPlaying) {
          await audioObject.pause();
        } else {
          await audioObject.play();
        }
      }
    } catch (error) {
      Logger.error("Error toggling file", error);
    }
  }

  async changeVolume(file: AudioFile, volume: number) {
    const audioObject = this.audioObjects[file.id];

    if (!audioObject) {
      throw new Error(`Audio object with id ${file.id} not found`);
    }

    if (audioObject) {
      await audioObject.setVolume(volume);
    }
  }

  hasFile(file: AudioFile) {
    return this.files.find((f) => f.id === file.id) !== undefined;
  }

  async setMetadata(mixId: string, title: string) {
    await this.addNotificationAudioFile();

    this.mixId = mixId;
    this.audioTitle = title;

    Logger.log(
      `Setting metadata for silent wav file with title ${this.audioTitle}`
    );

    // TODO: Implement this using expo-video
    // await AudioPlayer.changeMetadata({
    //   audioId: SILENT_WAV_FILE_ID,
    //   friendlyTitle: this.audioTitle,
    // });
  }

  async playAllFiles() {
    await this.addNotificationAudioFile();
    await this.playFile(SILENT_WAV_AUDIO_FILE);

    Logger.log("Playing all files", this.files);

    const playPromises = this.files.map((file) => this.playFile(file));
    await Promise.all(playPromises);
  }

  async stopAllFiles() {
    const stopPromises = [];

    if (this.isNotificationFileAdded) {
      stopPromises.push(this.stopFile(SILENT_WAV_AUDIO_FILE));
    }

    for (const file of this.files) {
      stopPromises.push(this.stopFile(file));
    }

    await Promise.all(stopPromises);
  }

  async clearFiles() {
    await this.stopAllFiles();

    const removePromises = [];
    removePromises.push(this.removeFile(SILENT_WAV_AUDIO_FILE));

    for (const file of this.files.reverse()) {
      removePromises.push(this.removeFile(file));
    }

    await Promise.all(removePromises);

    this.files = [];
    this.audioObjects = {};
    this.isNotificationFileAdded = false;
  }
}

export default iOSAudioManager;
