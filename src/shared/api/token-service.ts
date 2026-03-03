const PERSIST_KEY = "access_token";
let accessToken: string | null = null;

export const tokenService = {
  getToken(): string | null {
    if (accessToken) return accessToken;
    const stored = localStorage.getItem(PERSIST_KEY);
    if (stored) {
      accessToken = stored;
      return accessToken;
    }
    return null;
  },

  setToken(token: string | null) {
    accessToken = token;
    if (token) localStorage.setItem(PERSIST_KEY, token);
    else localStorage.removeItem(PERSIST_KEY);
  },

  clear() {
    accessToken = null;
    localStorage.removeItem(PERSIST_KEY);
  },
};
