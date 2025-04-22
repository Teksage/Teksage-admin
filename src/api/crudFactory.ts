import axiosInstance from "./axiosInstance";

type Method = "get" | "post" | "put" | "delete";

interface RequestOptions {
  endpoint: string;
  method: Method;
  data?: object;
  params?: object;
}

export const callAPI = async ({ endpoint, method, data = {}, params = {} }: RequestOptions) => {
  try {
    const config = { params };
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
