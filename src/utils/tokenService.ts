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
  
// src/utils/tokenService.ts
import axios from "axios";

export const tokenService = {
  getAccessToken: () => localStorage.getItem("access_token"),
  getRefreshToken: () => localStorage.getItem("refresh_token"),
  getUser: () => localStorage.getItem("user_name"),

  setTokens: ({ access, refresh, user }: { access: string; refresh: string; user: string }) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user_name", user);

    // Proactive token refresh (assuming token expires in 15 minutes)
    const refreshIn = 12 * 60 * 1000; // 12 minutes in milliseconds
    setTimeout(async () => {
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available for proactive refresh");
        }

        const res = await axios.post(
          "http://ec2-13-200-235-10.ap-south-1.compute.amazonaws.com/api/auth/refresh",
          { refresh_token: refreshToken },
          { timeout: 5000 }
        );

        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        // Recursively set tokens to schedule the next refresh
        tokenService.setTokens({
          access: newAccessToken,
          refresh: newRefreshToken,
          user: `${res.data.first_name} ${res.data.last_name}`,
        });
      } catch (err) {
        console.error("Proactive token refresh failed:", err);
        tokenService.clearTokens();
        window.location.href = "/auth/login";
      }
    }, refreshIn);
  },

  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_name");
  },
};