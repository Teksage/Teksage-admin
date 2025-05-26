import axiosInstance from "../api/axiosInstance"; // Your axios instance
import { useState, useEffect } from "react";

// Default fallback country (e.g., India)
const defaultCountriesList = [
  { dial_code: "+91", name: "India" },
];

export const useCountriesList = () => {
  const [countriesList, setCountriesList] = useState(defaultCountriesList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/countries");
        setCountriesList(response.data || defaultCountriesList);
      } catch (err: any) {
        console.error("Failed to fetch countries:", err.message || err);
        setError("Failed to load country codes. Using default (India).");
        setCountriesList(defaultCountriesList); // Fallback to default
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countriesList, loading, error };
};