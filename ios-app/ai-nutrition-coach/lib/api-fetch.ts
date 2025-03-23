import {
  AudioFile,
  Mix,
  SunData,
  User,
  AppleLoginResponse,
} from "@/types/index";
import Logger from "./Logger";
import { debounce } from "lodash";
import { useAppStore } from "../state/store";
import { getCachedData, setCachedData } from "./user-preferences-utils";
// import { playMix as playMixAudioUtil, stopPlayingMix, stopAudioFile } from './audio-manager-utils';
// import getAudioManagerInstance from './AudioManagerSingleton';
// import { clearAllSecureData } from './secure-data-utils';
import { logout, setCurrentUser } from "./auth-utils";
import { apiFetch } from "./api-client";
import db from "@/db/db";
import { mixes, audioFiles } from "@/db/schema";
import { eq } from "drizzle-orm";

const USER_MIXES_CACHE_KEY = "userMixes";

export const fetchUserMixes = async () => {
  const currentUser = useAppStore.getState().currentUser;
  if (!currentUser) return;

  // Check if there are any mixes in the local db
  const existingMixes = await db.select().from(mixes);
  if (existingMixes.length > 0) {
    Logger.log("Found existing mixes in local db", existingMixes.length);
    return;
  }

  const { setIsFetchingUserMixes } = useAppStore.getState();
  setIsFetchingUserMixes(true);

  Logger.log("fetching user mixes", currentUser);

  try {
    const response = await apiFetch("/mixes", {
      currentUser,
    });

    if (response.status === 500) {
      Logger.error("Server error while fetching user mixes");
      setIsFetchingUserMixes(false);
      return;
    }

    const data = await response.json();
    Logger.log("user mixes", JSON.stringify(data));

    // Set the user mixes in the sqllite db
    if (data) {
      for (const mix of data) {
        const insertValues = {
          id: mix.id,
          name: mix.name,
          createdAt: new Date(mix.createdAt),
          updatedAt: new Date(mix.updatedAt),
          audioFiles: mix.audioFiles.map((file: AudioFile) => ({
            id: file.id,
            userPrompt: file.userPrompt,
            fileUrl: file.fileUrl,
            volume: file.volume,
          })),
        };

        // Check if mix already exists
        const existingMix = await db
          .select()
          .from(mixes)
          .where(eq(mixes.id, mix.id));
        if (existingMix.length === 0) {
          Logger.log("inserting mix", insertValues);
          await db.insert(mixes).values(insertValues);
        } else {
          Logger.log("mix already exists, skipping insert", mix.id);
        }
      }
    }
  } catch (error) {
    Logger.error("Error fetching user mixes:", error);
    setIsFetchingUserMixes(false);
    throw error;
  }

  setIsFetchingUserMixes(false);
};

export const fetchUserAudioFiles = async () => {
  const currentUser = useAppStore.getState().currentUser;
  if (!currentUser) return;

  Logger.log("fetching user audio files", currentUser);

  try {
    const response = await apiFetch("/audio_files", {
      currentUser,
    });

    if (response.status === 500) {
      Logger.error("Server error while fetching user audio files");
      return;
    }

    const data = await response.json();
    Logger.log("user audio files", data);

    // Store/update the audio files in the SQLite db
    if (data) {
      for (const file of data) {
        const values = {
          id: file.id,
          userPrompt: file.userPrompt,
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileType: file.fileType,
          createdAt: file.createdAt ? new Date(file.createdAt) : new Date(),
          updatedAt: file.updatedAt ? new Date(file.updatedAt) : new Date(),
        };

        await db
          .insert(audioFiles)
          .values(values)
          .onConflictDoUpdate({
            target: audioFiles.id,
            set: {
              userPrompt: values.userPrompt,
              fileName: values.fileName,
              fileUrl: values.fileUrl,
              fileType: values.fileType,
              createdAt: values.createdAt,
              updatedAt: values.updatedAt,
            },
          });

        Logger.log("upserted audio file", file.id);
      }
    }
  } catch (error) {
    Logger.error("Error fetching user audio files:", error);
    throw error;
  }
};

// export const createMix = async ({
//   name,
//   audioFiles,
// }: {
//   name: string;
//   audioFiles: AudioFile[];
// }): Promise<Mix | undefined> => {
//   const { currentUser, setUserMixes } = useAppStore.getState();

//   const response = await apiFetch("mixes", {
//     method: "POST",
//     currentUser,
//     body: JSON.stringify({
//       name,
//       audioFiles: audioFiles.map((file) => file.id),
//     }),
//   });

//   if (response.ok) {
//     const newMix = (await response.json()) as Mix;
//     const userMixes = useAppStore.getState().userMixes || [];

//     setUserMixes([...userMixes, newMix]);

//     return newMix;
//   } else {
//     Logger.error("failed to create new mix");
//     return undefined;
//   }
// };

// const formatAudioFileIdsForSave = (
//   audioFiles: Mix["audioFiles"] | Array<number> | undefined
// ) => {
//   if (audioFiles && audioFiles[0] && typeof audioFiles[0] === "number") {
//     return audioFiles;
//   }
//   if (
//     audioFiles &&
//     audioFiles[0] &&
//     typeof audioFiles[0] === "object" &&
//     "id" in audioFiles[0]
//   ) {
//     return (audioFiles as Mix["audioFiles"]).map((file) => file.id);
//   }
//   return [];
// };

// export const updateMix = async ({ updatedMix }: { updatedMix: Mix }) => {
//   const { currentUser, userMixes, setUserMixes } = useAppStore.getState();

//   setUserMixes(
//     (userMixes || []).map((mix: Mix) =>
//       mix.id === updatedMix.id ? updatedMix : mix
//     )
//   );

//   if (updatedMix.isTemporary) {
//     return;
//   }

//   const response = await apiFetch(`mixes/${updatedMix.id}`, {
//     method: "PATCH",
//     currentUser,
//     body: JSON.stringify({
//       mix: {
//         ...updatedMix,
//         audioFiles: formatAudioFileIdsForSave(updatedMix.audioFiles),
//       },
//     }),
//   });

//   if (response.ok) {
//     Logger.log("updated mix");
//   } else {
//     Logger.error("failed to update mix");
//   }
// };

// export const addFileToMix = async (mix: Mix, file: AudioFile, playIfOnlySound = true) => {
//   Logger.log(`Adding file ${file.id} to mix ${mix.id}`);

//   const audioManager = getAudioManagerInstance();
//   const { isPlaying, nowPlayingMixId } = useAppStore.getState();

//   const isFirstSound = mix.audioFiles.length === 0;
//   const playAsFirstSound = playIfOnlySound && isFirstSound;

//   const updatedMix = {
//     ...mix,
//     audioFiles: [...mix.audioFiles, file]
//   }
//   await updateMix({ updatedMix });

//   if (nowPlayingMixId === mix.id) {
//     // this mix is already in the now playing panel, so add the file
//     // to the audio manager
//     await audioManager.addFile(file);

//     // If the mix is already playing, play the sound
//     if (isPlaying) {
//       await audioManager.playFile(file);
//     }
//     // otherwise it's the now playing mix but it's not actually playing
//     // so add the file and then play the mix
//     else if (playAsFirstSound) {
//       playMixAudioUtil(updatedMix);
//     }
//   } else if (nowPlayingMixId === null && playAsFirstSound) {
//     playMixAudioUtil(updatedMix);
//   }
// };

// export const removeAudioFileFromMix = async (mix: Mix, file: AudioFile) => {
//   const updatedMix = {
//     ...mix,
//     audioFiles: mix.audioFiles.filter((audioFile) => audioFile.id !== file.id)
//   }
//   const audioManager = getAudioManagerInstance();
//   await stopAudioFile(file);
//   await audioManager.removeFile(file);

//   await updateMix({ updatedMix });

//   if (updatedMix.audioFiles.length === 0) {
//     await stopPlayingMix();
//   }
// };

// const debouncedPatchFileVolume = debounce(async (mix: Mix, file: AudioFile, volume: number) => {
//   const { currentUser } = useAppStore.getState();

//   // Now persist the volume to the server
//   await apiFetch(`mixes/${mix.id}`, {
//     method: 'PATCH',
//     currentUser,
//     body: JSON.stringify({
//       mix: {
//         ...mix, audioFiles: mix.audioFiles.map((localFile) => {
//           if (localFile.id === file.id) {
//             return {
//               ...localFile,
//               volume
//             };
//           }
//           return localFile;
//         })
//       }
//     })
//   });
// }, 200);

// export const changeFileVolume = async (mixToChange: Mix, file: AudioFile, volume: number) => {
//   const audioManager = getAudioManagerInstance();
//   const { userMixes, setUserMixes, isOffline } = useAppStore.getState();

//   const mix = userMixes?.find((mix) => mix.id === mixToChange.id);
//   if (!mix) {
//     Logger.error(`Cannot change volume, mix with id  ${mixToChange.id} not found`);
//     return;
//   }

//   // Only change the volume if it's the currently playing mix
//   if (audioManager && audioManager.mixId === mix.id) {
//     await audioManager.changeVolume(file, volume);
//   }

//   setUserMixes((userMixes || []).map(localMix =>
//     localMix.id === mix.id
//       ? {
//         ...localMix, audioFiles: localMix.audioFiles.map(f =>
//           f.id === file.id ? { ...f, volume } : f
//         )
//       }
//       : localMix
//   ));

//   if (!isOffline && !mix.isTemporary) {
//     await debouncedPatchFileVolume(mix, file, volume);
//   }
// };

export const submitLogin = async (email: string, password: string) => {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();

    Logger.log("login success", data);
    setCurrentUser(data as User);
  } else {
    Logger.error("login failed", response);
    let message = "Login failed";

    try {
      const data = await response.json();
      message = data?.errors?.[0]?.message ?? message;
    } catch (e) {}

    throw new Error(message);
  }
};

export const submitSignup = async (email: string, password: string) => {
  const response = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  Logger.log("signup response", response);

  if (response.ok) {
    const data = await response.json();

    Logger.log("signup success", data);

    setCurrentUser(data as User);
  } else {
    Logger.error("signup failed", response);
    let message = "Signup failed";

    try {
      const data = await response.json();
      message = data?.error || message;
    } catch (e) {
      message = response.statusText || message;
    }

    throw new Error(message);
  }
};

// export const verifyAppleLoginResp = async (appleLoginResponse: AppleLoginResponse) => {
//   try {
//     if (!appleLoginResponse || !appleLoginResponse.user || !appleLoginResponse.identityToken || !appleLoginResponse.authorizationCode) {
//       const errorMsg = 'Invalid Apple login response, must have all of user, identityToken, and authorizationCode';
//       Logger.error(errorMsg);
//       throw new Error(errorMsg);
//     }

//     Logger.log('Verifying Apple login with appleLoginResponse', JSON.stringify(appleLoginResponse));

//     const response = await apiFetch('/auth/verify-apple-login', {
//       method: 'POST',
//       body: JSON.stringify(appleLoginResponse)
//     });

//     if (response.ok) {
//       const data = await response.json();

//       Logger.log('Verify apple login success', data);
//       setCurrentUser(data as User);
//     } else {
//       Logger.error('Verify apple login failed', response);
//       let message = 'Apple login failed';

//       try {
//         const data = await response.json();
//         // message = data?.errors?.[0]?.message ?? message;
//         if (data != null) {
//           message = JSON.stringify(data);
//         }
//       } catch (e) {
//       }

//       throw new Error(message);
//     }
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       Logger.error('Error verifying Apple login:', error.message);
//       throw error;
//     }
//   }
// }

const SUN_DATA_API_URL = "https://api.sunrisesunset.io/json";
export const fetchSunData = async (lat: number, lng: number) => {
  const response = await fetch(SUN_DATA_API_URL + `?lat=${lat}&lng=${lng}`, {
    method: "GET",
  });
  const data = await response.json();
  useAppStore.getState().setSunData(data.results as SunData);
};

const deleteAccountRequest = async () => {
  const { currentUser } = useAppStore.getState();

  await apiFetch("/users/delete_account", {
    method: "DELETE",
    currentUser,
  });
};

export const deleteAccount = async () => {
  await deleteAccountRequest();
  await logout();
};
