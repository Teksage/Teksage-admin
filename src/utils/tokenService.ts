export const tokenService = {
  getAccessToken: () => {
    try {
      return localStorage.getItem("access_token");
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  getRefreshToken: () => {
    try {
      return localStorage.getItem("refresh_token");
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  getUser: () => {
    try {
      return localStorage.getItem("user_name");
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  getUserType: () => {
    try {
      return (localStorage.getItem("user_type") || "").toLowerCase();
    } catch (error) {
      console.error("Error getting user type:", error);
      return "";
    }
  },

  isPartner: () => tokenService.getUserType() === "partner",

  setTokens: ({
    access,
    refresh,
    user,
    userType,
  }: {
    access: string;
    refresh: string;
    user: string;
    userType?: string;
  }) => {
    try {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_name", user);
      localStorage.setItem("session_timestamp", Date.now().toString());
      if (userType !== undefined) {
        localStorage.setItem("user_type", String(userType).toLowerCase());
      }
    } catch (error) {
      console.error("Error setting tokens:", error);
    }
  },

  clearTokens: () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_type");
      localStorage.removeItem("session_timestamp");
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },

  isTokenValid: () => {
    const token = tokenService.getAccessToken();
    const timestamp = localStorage.getItem("session_timestamp");

    if (!token || !timestamp) return false;

    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000;

    return sessionAge < maxAge;
  },

  hasValidSession: (): boolean => {
    const token = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken();
    const isValid = tokenService.isTokenValid();
    return Boolean(token && refreshToken && isValid);
  },
};
