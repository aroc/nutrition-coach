import { create } from "zustand";
import { User, Mix, AudioFile, SunData } from "../types";

export type AppStore = {
  // User
  currentUser: User | null;
  setCurrentUserState: (user: User | null) => void;
  currentUserHasBeenFetched: boolean;
  setCurrentUserHasBeenFetched: (hasBeenFetched: boolean) => void;
  logout: () => void;
  isOffline: boolean;
  setIsOffline: (isOffline: boolean) => void;

  // Sun Data
  sunData: SunData | null;
  setSunData: (sunData: SunData | null) => void;

  // Playback
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  nowPlayingMix: Mix | null;
  setNowPlayingMix: (mix: Mix | null) => void;
  stopPlayingMix: () => void;
  playMix: (mix: Mix) => void;

  // Downloading state
  isFetchingUserMixes: boolean;
  setIsFetchingUserMixes: (isFetching: boolean) => void;
  setIsDownloadingMixAudioFiles: (mix: Mix) => void;
  getAreMixFilesBeingDownloaded: (mix: Mix) => boolean;
  getIsAudioFileBeingDownloaded: (fileId: string) => boolean;
  audioFilesBeingDownloaded: string[];
  setAudioFileBeingDownloaded: (fileId: string) => void;
  removeAudioFilesBeingDownloaded: (fileId: string) => void;

  // Mixes

  // userMixes: Mix[];
  // setUserMixes: (mixes: Mix[]) => void;
  // deleteUserMix: (mixId: string) => void;
  // getMix: (mixId: string | undefined | null) => Mix | undefined;
  // addAudioFileToMix: (mixId: string, file: AudioFile) => void;
  // removeAudioFileFromMix: (mixId: string, file: AudioFile) => void;
  // changeMixName: (mixId: string, name: string) => void;
  // changeMixAudioFileVolume: (
  //   mixId: string,
  //   file: AudioFile,
  //   volume: number
  // ) => void;

  // Audio Files
  // audioFiles: AudioFile[] | undefined;
  // setAudioFiles: (files: AudioFile[]) => void;
  // updateAudioFile: (file: AudioFile) => void;
};

export const useAppStore = create<AppStore>((set, get) => ({
  // User
  currentUser: null,
  currentUserHasBeenFetched: false,
  setCurrentUserHasBeenFetched: (hasBeenFetched: boolean) =>
    set({ currentUserHasBeenFetched: hasBeenFetched }),
  setCurrentUserState: (user: User | null) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  isOffline: false,
  setIsOffline: (isOffline: boolean) => set({ isOffline }),

  // Playback
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  nowPlayingMix: null,
  setNowPlayingMix: (mix: Mix | null) => set({ nowPlayingMix: mix }),
  stopPlayingMix: () => set({ isPlaying: false }),
  playMix: (mix: Mix) => set({ isPlaying: true, nowPlayingMix: mix }),

  // Downloading state
  audioFilesBeingDownloaded: [],
  setIsDownloadingMixAudioFiles: (mix: Mix) => {
    // for each audio file in the mix, set is downloading to true
    set((state) => {
      const newSet = new Set([
        ...state.audioFilesBeingDownloaded,
        ...mix.audioFiles.map((file) => file.id),
      ]);
      return { ...state, audioFilesBeingDownloaded: Array.from(newSet) };
    });
  },
  getAreMixFilesBeingDownloaded: (mix: Mix) => {
    return mix.audioFiles.some((file) =>
      get().audioFilesBeingDownloaded.includes(file.id)
    );
  },
  getIsAudioFileBeingDownloaded: (fileId: string) =>
    get().audioFilesBeingDownloaded.includes(fileId),
  setAudioFileBeingDownloaded: (fileId: string) =>
    set((state) => {
      const newSet = new Set([...state.audioFilesBeingDownloaded, fileId]);
      return { ...state, audioFilesBeingDownloaded: Array.from(newSet) };
    }),
  removeAudioFilesBeingDownloaded: (fileId: string) =>
    set((state) => {
      const newSet = new Set(
        state.audioFilesBeingDownloaded.filter((id) => id !== fileId)
      );
      return { ...state, audioFilesBeingDownloaded: Array.from(newSet) };
    }),

  // Sun Data
  sunData: null,
  setSunData: (sunData: SunData | null) => set({ sunData }),

  // Mixes
  // userMixes: [],

  isFetchingUserMixes: false,
  setIsFetchingUserMixes: (isFetching: boolean) =>
    set({ isFetchingUserMixes: isFetching }),

  // setUserMixes: (mixes: Mix[]) =>
  //   set({ userMixes: mixes != null ? mixes : [] }),
  // deleteUserMix: (mixId: string) =>
  //   set((state) => ({
  //     userMixes: state.userMixes.filter((m) => m.id !== mixId),
  //   })),
  // getMix: (mixId: string | undefined | null): Mix | undefined =>
  //   get().userMixes.find((m) => m.id === mixId),
  // addAudioFileToMix: (mixId: string, file: AudioFile) =>
  //   set((state) => {
  //     // Map through all mixes
  //     const updatedMixes = state.userMixes.map((mix) => {
  //       // If this is not the target mix, return it unchanged
  //       if (mix.id !== mixId) {
  //         return mix;
  //       }

  //       // For the target mix, add the new audio file
  //       return {
  //         ...mix,
  //         audioFiles: [...mix.audioFiles, file],
  //       };
  //     });

  //     return { userMixes: updatedMixes };
  //   }),

  // removeAudioFileFromMix: (mixId: string, file: AudioFile) =>
  //   set((state) => {
  //     // Map through all mixes
  //     const updatedMixes = state.userMixes?.map((mix) => {
  //       // If this is not the target mix, return it unchanged
  //       if (mix.id !== mixId) {
  //         return mix;
  //       }

  //       // For the target mix, filter out the specified audio file
  //       return {
  //         ...mix,
  //         audioFiles:
  //           mix.audioFiles?.filter((audioFile) => audioFile.id !== file.id) ||
  //           [],
  //       };
  //     });

  //     return { userMixes: updatedMixes };
  //   }),

  // changeMixName: (mixId: string, name: string) =>
  //   set((state) => {
  //     // Map through all mixes
  //     const updatedMixes = state.userMixes?.map((mix) => {
  //       // If this is not the target mix, return it unchanged
  //       if (mix.id !== mixId) {
  //         return mix;
  //       }

  //       // For the target mix, update the name
  //       return {
  //         ...mix,
  //         name,
  //       };
  //     });

  //     return { userMixes: updatedMixes };
  //   }),

  // changeMixAudioFileVolume: (mixId: string, file: AudioFile, volume: number) =>
  //   set((state) => {
  //     // Map through all mixes
  //     const updatedMixes = state.userMixes?.map((mix) => {
  //       // If this is not the target mix, return it unchanged
  //       if (mix.id !== mixId) {
  //         return mix;
  //       }

  //       // For the target mix, map through audio files
  //       const updatedAudioFiles = mix.audioFiles.map((audioFile) => {
  //         // If this is not the target file, return it unchanged
  //         if (audioFile.id !== file.id) {
  //           return audioFile;
  //         }

  //         // For the target file, update the volume
  //         return {
  //           ...audioFile,
  //           volume,
  //         };
  //       });

  //       return {
  //         ...mix,
  //         audioFiles: updatedAudioFiles,
  //       };
  //     });

  //     return { userMixes: updatedMixes };
  //   }),

  // Audio Files
  // audioFiles: undefined,
  // setAudioFiles: (files: AudioFile[]) => set({ audioFiles: files }),
  // updateAudioFile: (file: AudioFile) =>
  //   set((state) => ({
  //     audioFiles: state.audioFiles?.map((f) => (f.id === file.id ? file : f)),
  //   })),
}));
