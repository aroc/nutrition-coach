import * as FileSystem from "expo-file-system";
import Logger from "./Logger";
import { AudioFile } from "../types";

export const audioFileIsInCache = async (url: string) => {
  const cacheDir = FileSystem.cacheDirectory;
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  const fileUri = `${cacheDir}${fileName}`;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  return fileInfo.exists;
};

/**
 * Downloads and caches audio files.
 */
export const getAudioFileFromCacheOrDownload = async (
  url: string
): Promise<string> => {
  const cacheDir = FileSystem.cacheDirectory; // Path to the cache directory
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  const fileUri = `${cacheDir}${fileName}`;

  // Check if the file already exists
  if (await audioFileIsInCache(url)) {
    Logger.log("Using cached audio file:", fileUri);
    return fileUri;
  }

  Logger.log("Downloading audio file...");

  const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
  try {
    const result = await downloadResumable.downloadAsync();
    if (!result) throw new Error("Download failed");
    return result.uri;
  } catch (error) {
    Logger.error("Error downloading audio file:", error);
    throw error;
  }
};

/**
 * Downloads and caches multiple audio files in parallel.
 * @param urls - Array of URLs to audio files that need to be downloaded or retrieved from cache
 * @returns Promise<string[] | null> - Array of local file paths corresponding to the input URLs
 */
export const getAudioFilesFromCacheOrDownload = async (
  files: AudioFile[],
  addAudioFileBeingDownloaded: (fileId: AudioFile["id"]) => void,
  removeAudioFileBeingDownloaded: (fileId: AudioFile["id"]) => void
): Promise<string[]> => {
  try {
    // Create an array of promises without awaiting them immediately
    const downloadPromises = files.map((file) => {
      return (async () => {
        if (!file.fileUrl) {
          Logger.error(`No file URL for file ${file.id}`);
          return null;
        }

        const isInCache = await audioFileIsInCache(file.fileUrl);
        if (isInCache) {
          removeAudioFileBeingDownloaded(file.id);
          return file.fileUrl;
        }

        addAudioFileBeingDownloaded(file.id);
        const fileFullURL = `${process.env.EXPO_PUBLIC_S3_BASE_URL}${file.fileUrl}`;
        try {
          const cachedFileUrl = await getAudioFileFromCacheOrDownload(
            fileFullURL
          );
          return cachedFileUrl;
        } finally {
          removeAudioFileBeingDownloaded(file.id);
        }
      })();
    });

    // Now execute all promises in parallel
    const filePaths = await Promise.all(downloadPromises);
    return filePaths.filter((filePath) => filePath !== null) as string[];
  } catch (error) {
    Logger.error("Error handling multiple audio files:", error);
    throw error;
  }
};

/**
 * Cleans up old or unnecessary files in the cache directory.
 * @param maxFileAgeInDays - The maximum age of files to keep (in days).
 * @returns {Promise<void>} - Resolves when cleanup is complete.
 */
export const cleanupCache = async (maxFileAgeInDays = 7): Promise<void> => {
  const cacheDir = FileSystem.cacheDirectory;

  if (!cacheDir) {
    Logger.error("Cache directory not found");
    return;
  }

  try {
    Logger.log("Listing files in cache directory...");
    const files = await FileSystem.readDirectoryAsync(cacheDir); // List all files in the directory

    const now = Date.now();
    const maxFileAgeMs = maxFileAgeInDays * 24 * 60 * 60 * 1000;

    for (const fileName of files) {
      const filePath = `${cacheDir}${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      const modTime =
        "modificationTime" in fileInfo ? fileInfo.modificationTime : Date.now();

      if (!fileInfo.isDirectory) {
        try {
          const fileAge = now - modTime;
          if (fileAge > maxFileAgeMs) {
            Logger.log(`Deleting old file: ${fileName}`);
            await FileSystem.deleteAsync(filePath);
          } else {
            Logger.log(`Keeping file: ${fileName}`);
          }
        } catch (err) {
          Logger.warn(`Could not access file metadata for: ${fileName}`, err);
        }
      }
    }
    Logger.log("Cache cleanup completed.");
  } catch (error) {
    Logger.error("Error cleaning up cache directory:", error);
  }
};

// interface FileInfo {
//   exists: boolean;
//   uri: string;
//   size?: number;
//   modificationTime?: number;
//   isDirectory?: boolean;
// }

// const resolveFileEntry = async (filePath: string): Promise<FileInfo | null> => {
//   try {
//     const fileInfo = await FileSystem.getInfoAsync(filePath);
//     if (fileInfo.exists) {
//       console.log("File size:", fileInfo.size);
//       console.log("Last modified:", new Date(fileInfo.modificationTime ?? 0));
//       return fileInfo;
//     } else {
//       console.log("File does not exist at:", filePath);
//       return null;
//     }
//   } catch (error) {
//     console.error("Error getting file info:", error);
//     throw error;
//   }
// };

// const getFileModificationTime = async (
//   fileUri: string
// ): Promise<number | null> => {
//   try {
//     const fileInfo = await FileSystem.getInfoAsync(fileUri);
//     if (fileInfo.exists && fileInfo.modificationTime) {
//       return fileInfo.modificationTime;
//     } else {
//       console.log("File does not exist or modification time is unavailable.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error retrieving file modification time:", error);
//     return null;
//   }
// };
