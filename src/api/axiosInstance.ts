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

// src/utils/axiosInstance.ts
import axios from "axios";
import axiosRetry from "axios-retry"; // Import axios-retry
import { tokenService } from "../utils/tokenService";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://ec2-13-200-235-10.ap-south-1.compute.amazonaws.com/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout to prevent hanging requests
});

// Configure axios-retry (Add this right after creating axiosInstance)
axiosRetry(axiosInstance, {
  retries: 2, // Retry twice
  retryDelay: (retryCount) => retryCount * 1000, // 1s, 2s delays (1000ms, 2000ms)
  retryCondition: (error) => {
    return error.code === "ECONNABORTED" || !error.response; // Retry on timeout or network errors
  },
});

// Request Interceptor: Add Authorization header
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

// Response Interceptor: Handle token refresh and 401 errors
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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
          { timeout: 5000 } // 5 seconds timeout for refresh request
        );

        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        tokenService.setTokens({
          access: newAccessToken,
          refresh: newRefreshToken,
          user: `${res.data.first_name} ${res.data.last_name}`,
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (err: any) {
        console.error("Token refresh failed:", err.message || err);
        processQueue(err, null);
        tokenService.clearTokens();
        console.warn("Session expired, redirecting to login...");
        window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("Response interceptor error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;