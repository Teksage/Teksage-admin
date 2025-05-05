// import axiosInstance from "./axiosInstance";
// import { tokenService } from "../utils/tokenService"; // Assuming tokenService is in a separate file
// import axios from "axios";

// type Method = "get" | "post" | "put" | "delete";

// interface RequestOptions {
//   endpoint: string;
//   method: Method;
//   data?: object;
//   params?: object;
//   headers?: object; // Optional custom headers
// }

// export const callAPI = async ({
//   endpoint,
//   method,
//   data = {},
//   params = {},
//   headers = {},
// }: RequestOptions) => {
//   try {
//     // Get the access token from storage
//     const accessToken = tokenService.getAccessToken();

//     // Set up the config with params and headers
//     const config = {
//       params,
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//         ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//       },
//     };

//     const response = await axiosInstance.request({
//       url: endpoint,
//       method,
//       data,
//       ...config,
//     });

//     return response;
//   } catch (error: any) {
//     console.error(`API ${method.toUpperCase()} ${endpoint} failed`, error);
//     throw error;
//   }
// };

// export const fetchPlaceSuggestions = async (inputText: string) => {
//   try {
//     const response = await axios.post(
//       "https://places.googleapis.com/v1/places:autocomplete",
//       {
//         input: inputText,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_API_KEY,
//           "X-Goog-FieldMask": "*",
//         },
//       }
//     );

//     const suggestions = response.data?.suggestions || [];

//     return suggestions
//       .filter((s: any) => s.placePrediction?.types?.includes("geocode"))
//       .map((s: any) => ({
//         label: s.placePrediction.text.text, // shown in dropdown
//         mainText: s.placePrediction.structuredFormat.mainText.text, // used in form
//       }));
//   } catch (err) {
//     console.error("Error fetching place suggestions:", err);
//     return [];
//   }
// };

// export const fetchFilterValues = async (table: string, field: string) => {
//   try {
//     const response = await callAPI({
//       endpoint: "api/admin/query",
//       method: "get",
//       params: {
//         table,
//         field,
//         // No 'value' parameter to fetch all unique values for the field
//       },
//     });

//     console.log(`Filter values for ${field}:`, response?.data);

//     // Assuming the response returns a list of unique values in response.data
//     const uniqueValues = Array.isArray(response?.data?.data)
//       ? response.data.data.map((value: any) => String(value)).filter(Boolean)
//       : [];

//     return uniqueValues.sort();
//   } catch (error) {
//     console.error(`Error fetching filter values for ${field}:`, error);
//     return [];
//   }
// };

import axiosInstance from "./axiosInstance";
import { tokenService } from "../utils/tokenService";
import axios from "axios";

type Method = "get" | "post" | "put" | "delete";

interface RequestOptions {
  endpoint: string;
  method: Method;
  data?: object;
  params?: object;
  headers?: object;
}

export const callAPI = async ({
  endpoint,
  method,
  data = {},
  params = {},
  headers = {},
}: RequestOptions) => {
  try {
    const accessToken = tokenService.getAccessToken();

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
        label: s.placePrediction.text.text,
        mainText: s.placePrediction.structuredFormat.mainText.text,
      }));
  } catch (err) {
    console.error("Error fetching place suggestions:", err);
    return [];
  }
};

export const fetchFilterValues = async (table: string, field: string, searchValue: string = "") => {
  try {
    const params: Record<string, string> = {
      table,
      field,
    };

    // Only include the 'value' parameter if searchValue is non-empty
    if (searchValue.trim()) {
      params.value = searchValue.trim();
    }

    console.log(`Fetching filter values with params:`, params);

    const response = await callAPI({
      endpoint: "api/admin/query",
      method: "get",
      params,
    });

    console.log(`Filter values response for ${field}:`, response?.data);

    // Ensure the response data is an array and map to strings
    const uniqueValues = Array.isArray(response?.data)
      ? [...new Set(response.data.map((value: any) => String(value).trim()))]
          .filter(Boolean)
          .sort()
      : [];
    console.log(uniqueValues, "uniqueValues")
    return uniqueValues;
  } catch (error) {
    console.error(`Error fetching filter values for ${field}:`, error);
    return [];
  }
};