// import axios from "axios";
// import { tokenService } from "../utils/tokenService";

// const axiosInstance = axios.create({
//   baseURL: "http://ec2-13-200-235-10.ap-south-1.compute.amazonaws.com/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000, // 10 seconds timeout to prevent hanging requests
// });

// // Request Interceptor: Add Authorization header
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = tokenService.getAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     console.error("Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor: Handle token refresh and 401 errors
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (token: string) => void;
//   reject: (err: any) => void;
// }> = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else if (token) {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token: string) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(axiosInstance(originalRequest));
//             },
//             reject: (err: any) => reject(err),
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const refreshToken = tokenService.getRefreshToken();
//         if (!refreshToken) {
//           throw new Error("No refresh token available");
//         }

//         const res = await axios.post(
//           "http://ec2-13-200-235-10.ap-south-1.compute.amazonaws.com/api/auth/refresh",
//           { refresh_token: refreshToken },
//           { timeout: 5000 } // 5 seconds timeout for refresh request
//         );

//         const newAccessToken = res.data.access_token;
//         const newRefreshToken = res.data.refresh_token;

//         tokenService.setTokens({
//           access: newAccessToken,
//           refresh: newRefreshToken,
//           user: `${res.data.first_name} ${res.data.last_name}`,
//         });

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         processQueue(null, newAccessToken);
//         return axiosInstance(originalRequest);
//       } catch (err: any) {
//         console.error("Token refresh failed:", err.message || err);
//         processQueue(err, null);
//         tokenService.clearTokens();
//         console.warn("Session expired, redirecting to login...");
//         window.location.href = "/auth/login";
//         return Promise.reject(err); // Preserve the error
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // Log the error for debugging but preserve the full error object
//     console.error("Response interceptor error:", error);
//     return Promise.reject(error); // Pass the original error object
//   }
// );

// export default axiosInstance;

import axios from "axios";
import { tokenService } from "../utils/tokenService";

const axiosInstance = axios.create({
  // baseURL: "http://ec2-13-200-235-10.ap-south-1.compute.amazonaws.com/",
  baseURL: "http://ec2-15-206-194-79.ap-south-1.compute.amazonaws.com:8000/",
  // baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor with improved token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  tokenService.clearTokens();
  // Avoid infinite redirects
  if (window.location.pathname !== "/auth/login") {
    window.location.href = "/auth/login";
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401 errors and if we haven't already tried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await axios.post(
          "http://ec2-13-200-235-10.ap-south-1.compute.amazonaws.com/api/auth/refresh",
          { refresh_token: refreshToken },
          { 
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;
        const userName = res.data.first_name && res.data.last_name 
          ? `${res.data.first_name} ${res.data.last_name}` 
          : tokenService.getUser() || "User";

        tokenService.setTokens({
          access: newAccessToken,
          refresh: newRefreshToken,
          user: userName,
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error("Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        redirectToLogin();
        return Promise.reject(new Error("Session expired. Please login again."));
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, preserve the original error
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;