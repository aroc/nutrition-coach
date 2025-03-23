import Logger from "./Logger";
import { User } from "@/types/index";
import {
  getSecureData,
  setSecureData,
  removeSecureData,
  clearAllSecureData,
} from "./secure-data-utils";
import { useAppStore } from "../state/store";
import { apiFetch } from "./api-client";

const USER_WITH_TOKEN_KEY = "userWithtoken";

export const setCurrentUser = async (user: User | null) => {
  const { setCurrentUserState } = useAppStore.getState();

  try {
    if (user) {
      Logger.setCurrentUser(user);
      Logger.log("setting current user", user);
      setCurrentUserState(user);
      await setSecureData(USER_WITH_TOKEN_KEY, user);
      useAppStore.getState().setCurrentUserHasBeenFetched(true);
    } else {
      setCurrentUserState(null);
      await removeSecureData(USER_WITH_TOKEN_KEY);
    }
  } catch (e) {
    Logger.error("failed to set secure data", e);
  }
};

export const getUser = async () => {
  const userWithToken = (await getSecureData(
    USER_WITH_TOKEN_KEY
  )) as User | null;

  if (userWithToken) {
    useAppStore.getState().setCurrentUserState(userWithToken);
  }

  useAppStore.getState().setCurrentUserHasBeenFetched(true);
};

export const logout = async () => {
  await logoutRequest();
  await clearAllSecureData();
  setCurrentUser(null);
};

export const logoutRequest = async () => {
  const { currentUser } = useAppStore.getState();

  await apiFetch("/auth/logout", {
    method: "POST",
    currentUser,
  });
};
