import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCachedData = async (key: string) => {
  const platform = Platform.OS;

  try {
    let rawData = null;

    if (platform === 'ios' || platform === 'android' || platform === 'web') {
      rawData = await AsyncStorage.getItem(key);
    } else {
      console.warn(`Unsupported platform: ${platform}`);
      return null;
    }

    if (!rawData) {
      return null;
    }

    const parsedData = JSON.parse(rawData);
    console.log(`Found cached ${key}`, parsedData);
    return parsedData;

  } catch (error) {
    console.error(`Error handling cached ${key}:`, error);
    return null;
  }
};

export const setCachedData = async (key: string, data: string | Record<string, any>) => {
  const platform = Platform.OS;

  try {
    const jsonData = JSON.stringify(data);

    if (platform === 'ios' || platform === 'android' || platform === 'web') {
      await AsyncStorage.setItem(key, jsonData);
    } else {
      console.warn(`Unsupported platform: ${platform}`);
      return;
    }

    console.log(`Cached ${key}`, data);

  } catch (error) {
    console.error(`Error caching ${key}:`, error);
  }
};