import {
  Box,
  Button,
  Checkbox,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { OptedInUser } from "../../../api/whatsappAdmin";

type OptedInUserPickerProps = {
  users: OptedInUser[];
  selectedIds: number[];
  onToggle: (userId: number) => void;
  onSelectAll: () => void;
  onClear: () => void;
};

export function OptedInUserPicker({
  users,
  selectedIds,
  onToggle,
  onSelectAll,
  onClear,
}: OptedInUserPickerProps) {
  const selectedCount = selectedIds.length;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1.5, py: 1, bgcolor: "grey.50" }}
      >
        <Typography variant="body2" color="text.secondary">
          {selectedCount} selected · {users.length} opted-in
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={onSelectAll} disabled={users.length === 0}>
            Select all
          </Button>
          <Button size="small" onClick={onClear} disabled={selectedCount === 0}>
            Clear
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
        {users.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            No opted-in users match your search.
          </Typography>
        ) : (
          users.map((user, index) => {
            const checked = selectedIds.includes(user.user_id);
            return (
              <Box key={user.user_id}>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  spacing={1}
                  sx={{
                    px: 1,
                    py: 1.25,
                    cursor: "pointer",
                    bgcolor: checked ? "action.selected" : "transparent",
                    "&:hover": { bgcolor: checked ? "action.selected" : "action.hover" },
                  }}
                  onClick={() => onToggle(user.user_id)}
                >
                  <Checkbox
                    checked={checked}
                    onChange={() => onToggle(user.user_id)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ mt: -0.5 }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      {user.phone_masked}
                      {user.email ? ` · ${user.email}` : ""}
                    </Typography>
                  </Box>
                </Stack>
                {index < users.length - 1 ? <Divider /> : null}
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
