import { User } from "../types";
import Logger from "./Logger";
import { useAppStore } from "../state/store";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const API_BASE_URL = "https://smoothnoise-production.up.railway.app";

export const apiFetch = async (
  path: string,
  options: RequestInit & { currentUser?: User | null } = {}
) => {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  Logger.log("apiFetch", url, options);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.currentUser
        ? { Authorization: `Bearer ${options.currentUser.token.token}` }
        : {}),
    },
  });

  if (!response.ok && response.status === 401) {
    // Auth token expired or invalid
    Logger.error("Authentication failed - please log in again");
    useAppStore.getState().logout();
  }

  return response;
};
