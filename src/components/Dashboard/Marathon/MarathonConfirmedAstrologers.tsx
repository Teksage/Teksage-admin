import { useState } from "react";
import { Alert, Box, Button, Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import type { MarathonAstrologerOption } from "../../../api/marathonAdmin";

type Person = { user_id: number; name: string };

type Props = {
  people: Person[];
  options: MarathonAstrologerOption[];
  onAdd: (userId: number) => void;
};

export function MarathonConfirmedAstrologers({ people, options, onAdd }: Props) {
  const [picked, setPicked] = useState<number | "">("");
  const taken = new Set(people.map((person) => person.user_id));
  const open = options.filter((person) => !taken.has(person.user_id));

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {people.length === 0 ? (
        <Alert severity="info">Publish stays off until at least one astrologer confirms participation.</Alert>
      ) : (
        <Box display="flex" gap={1} flexWrap="wrap">
          {people.map((person) => (
            <Chip key={person.user_id} label={person.name || `User ${person.user_id}`} />
          ))}
        </Box>
      )}
      <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel>Add astrologer</InputLabel>
          <Select
            value={picked}
            label="Add astrologer"
            onChange={(event) => setPicked(event.target.value as number)}
          >
            {open.map((person) => (
              <MenuItem key={person.user_id} value={person.user_id}>
                {person.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
          disabled={picked === ""}
          onClick={() => {
            if (picked === "") return;
            onAdd(picked);
            setPicked("");
          }}
          sx={{ textTransform: "none", bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}
        >
          Add to confirmed
        </Button>
      </Box>
    </Box>
  );
}
