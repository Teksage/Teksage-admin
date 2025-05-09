import { useEffect, useState, useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import debounce from "lodash.debounce";
import { fetchPlaceSuggestions } from "../../api/crudFactory";

interface SuggestionOption {
  label: string;
  mainText: string;
}

const PlaceAutocomplete = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}) => {
  const [options, setOptions] = useState<SuggestionOption[]>([]);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchSuggestionsDebounced = useMemo(
    () =>
      debounce(async (input: string) => {
        if (input.trim()) {
          const results = await fetchPlaceSuggestions(input);
          setOptions(results);
        } else {
          setOptions([]);
        }
      }, 400),
    []
  );

  // Handle blur to clear input if no suggestion is selected
  const handleBlur = () => {
    // Check if the current inputValue matches any option's label or mainText
    const isValidOption = options.some(
      (option) =>
        option.label === inputValue || option.mainText === inputValue
    );

    // If the inputValue doesn't match any suggestion, clear it
    if (!isValidOption && inputValue) {
      setInputValue("");
      onChange("");
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      filterOptions={(x) => x}
      inputValue={inputValue}
      onInputChange={(e, newInputValue) => {
        console.log(e);
        setInputValue(newInputValue);
        fetchSuggestionsDebounced(newInputValue);
      }}
      onChange={(e, newValue) => {
        console.log(e);
        if (typeof newValue === "string") {
          setInputValue(newValue);
          onChange(newValue);
        } else if (newValue) {
          setInputValue(newValue.mainText);
          onChange(newValue.mainText);
        } else {
          setInputValue("");
          onChange("");
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          disabled={disabled}
          size="small"
          onBlur={handleBlur} // Add onBlur handler
          InputLabelProps={{
            sx: {
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "#455a64",
            },
          }}
          InputProps={{
            ...params.InputProps,
            sx: { fontSize: "0.9rem", borderRadius: "6px" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#cfd8dc" },
              "&:hover fieldset": { borderColor: "#3f51b5" },
              "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
            },
            "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
          }}
        />
      )}
    />
  );
};

export default PlaceAutocomplete;