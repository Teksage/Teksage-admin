import axiosInstance from "./axiosInstance";
import { tokenService } from "../utils/tokenService"; // Assuming tokenService is in a separate file
import axios from "axios";

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
  headers = {},
}: RequestOptions) => {
  try {
    // Get the access token from storage
    const accessToken = tokenService.getAccessToken();

    // Set up the config with params and headers
    const config = {
      params,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
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

export const fetchPlaceSuggestions = async (inputText: string) => {
  try {
    const response = await axios.post(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        input: inputText,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_API_KEY,
          "X-Goog-FieldMask": "*",
        },
      }
    );

    const suggestions = response.data?.suggestions || [];

    return suggestions
      .filter((s: any) => s.placePrediction?.types?.includes("geocode"))
      .map((s: any) => ({
        label: s.placePrediction.text.text, // shown in dropdown
        mainText: s.placePrediction.structuredFormat.mainText.text, // used in form
      }));
  } catch (err) {
    console.error("Error fetching place suggestions:", err);
    return [];
  }
};


