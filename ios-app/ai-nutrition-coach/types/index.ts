import { Audio } from "expo-av";
import { FadingLooper } from "../lib/FadingLooper";

export type User = {
  id: string;
  email: string;
  appleUserId?: string;
  subscription?: "free" | "premium";
  token?: any;
};

export type AppleLoginResponse = {
  user: string | null;
  identityToken: string | null;
  authorizationCode: string | null;
  email: string | null;
  familyName?: string | null;
  givenName?: string | null;
};

export type ChatMessage = {
  id: string;
  message: string;
  isAssistant: boolean;
  createdAt: Date;
  updatedAt: Date;
};
