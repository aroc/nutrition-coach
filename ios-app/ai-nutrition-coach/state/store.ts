import { create } from "zustand";
import { User } from "../types/index";

export type AppStore = {
  // User
  currentUser: User | null;
  setCurrentUserState: (user: User | null) => void;
  currentUserHasBeenFetched: boolean;
  setCurrentUserHasBeenFetched: (hasBeenFetched: boolean) => void;
  logout: () => void;
  isOffline: boolean;
  setIsOffline: (isOffline: boolean) => void;

  isFetchingUserGoals: boolean;
  setIsFetchingUserGoals: (isFetchingUserGoals: boolean) => void;

  isFetchingLoggedFoodItems: boolean;
  setIsFetchingLoggedFoodItems: (isFetchingLoggedFoodItems: boolean) => void;

  // Chat messages
  isFetchingChatMessages: boolean;
  setIsFetchingChatMessages: (isFetchingChatMessages: boolean) => void;
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

  // User goals
  isFetchingUserGoals: false,
  setIsFetchingUserGoals: (isFetchingUserGoals: boolean) =>
    set({ isFetchingUserGoals }),

  // User logged food items
  isFetchingLoggedFoodItems: false,
  setIsFetchingLoggedFoodItems: (isFetchingLoggedFoodItems: boolean) =>
    set({ isFetchingLoggedFoodItems }),

  // Chat messages
  isFetchingChatMessages: false,
  setIsFetchingChatMessages: (isFetchingChatMessages: boolean) =>
    set({ isFetchingChatMessages }),
}));
