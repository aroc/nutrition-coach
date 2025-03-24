import * as SecureStore from "expo-secure-store";
import { USER_WITH_TOKEN_KEY } from "@/constants/index";

export const setSecureData = async (
  key: string,
  data: string | Record<string, any>
) => {
  const jsonValue = JSON.stringify(data);
  await SecureStore.setItemAsync(key, jsonValue);
};

export const getSecureData = async (key: string) => {
  try {
    const data = await SecureStore.getItemAsync(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    // Handle error if needed
    return null;
  }
};

export const removeSecureData = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

export const clearAllSecureData = async () => {
  // Clear all known secure data keys
  const knownKeys = [USER_WITH_TOKEN_KEY];

  for (const key of knownKeys) {
    await removeSecureData(key);
  }
};
