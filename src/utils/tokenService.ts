export const tokenService = {
    getAccessToken: () => localStorage.getItem("access_token"),
    getRefreshToken: () => localStorage.getItem("refresh_token"),
    getUser: () => localStorage.getItem("user_name"),
  
    setTokens: ({ access, refresh, user }: { access: string; refresh: string; user:string }) => {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_name", user);
    },
  
    clearTokens: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_name");
    },
  };
  