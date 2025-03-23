import * as SecureStore from 'expo-secure-store';

export const setSecureData = async (key: string, data: string | Record<string, any>) => {
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
  // SecureStore does not have a clear method; manage keys manually if needed
};