import axiosInstance from "./axiosInstance";
import { tokenService } from "../utils/tokenService"; // Assuming tokenService is in a separate file

type Method = "get" | "post" | "put" | "delete";

interface RequestOptions {
  endpoint: string;
  method: Method;
  data?: object;
  params?: object;
  headers?: object; // Optional custom headers
}

export const callAPI = async ({ 
  endpoint, 
  method, 
  data = {}, 
  params = {}, 
  headers = {} 
}: RequestOptions) => {
  try {
    // Get the access token from storage
    const accessToken = tokenService.getAccessToken();
    
    // Set up the config with params and headers
    const config = { 
      params,
      headers: {
        ...headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      }
    };
    
    const response = await axiosInstance.request({
      url: endpoint,
      method,
      data,
      ...config,
    });
    
    return response;
  } catch (error: any) {
    console.error(`API ${method.toUpperCase()} ${endpoint} failed`, error);
    throw error;
  }
};