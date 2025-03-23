export type AppleLoginResponse = {
  user: string;
  identityToken: string;
  authorizationCode: string;
  email: string | null;
  familyName?: string | null;
  givenName?: string | null;
};
