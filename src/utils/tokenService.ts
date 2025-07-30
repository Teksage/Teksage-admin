// export const tokenService = {
//     getAccessToken: () => localStorage.getItem("access_token"),
//     getRefreshToken: () => localStorage.getItem("refresh_token"),
//     getUser: () => localStorage.getItem("user_name"),

//     setTokens: ({ access, refresh, user }: { access: string; refresh: string; user:string }) => {
//       localStorage.setItem("access_token", access);
//       localStorage.setItem("refresh_token", refresh);
//       localStorage.setItem("user_name", user);
//     },

//     clearTokens: () => {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       localStorage.removeItem("user_name");
//     },
//   };

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

  setTokens: ({
    access,
    refresh,
    user,
  }: {
    access: string;
    refresh: string;
    user: string;
  }) => {
    try {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_name", user);
      localStorage.setItem("session_timestamp", Date.now().toString());
    } catch (error) {
      console.error("Error setting tokens:", error);
    }
  },

  clearTokens: () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("session_timestamp");
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },

  isTokenValid: () => {
    const token = tokenService.getAccessToken();
    const timestamp = localStorage.getItem("session_timestamp");

    if (!token || !timestamp) return false;

    // Check if session is older than 24 hours (adjust as needed)
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    return sessionAge < maxAge;
  },

  hasValidSession: (): boolean => {
    const token = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken();
    const isValid = tokenService.isTokenValid();

    // Ensure we return a boolean, not null
    return Boolean(token && refreshToken && isValid);
  },
};
