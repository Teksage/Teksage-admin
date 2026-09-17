import { Alert, Box } from "@mui/material";
import { Turnstile } from "@marsidev/react-turnstile";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();

interface AdminTurnstileProps {
  onTokenChange: (token: string | null) => void;
  remountKey: number;
}

export function AdminTurnstile({
  onTokenChange,
  remountKey,
}: AdminTurnstileProps) {
  if (!TURNSTILE_SITE_KEY) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        CAPTCHA is not configured. Contact the administrator.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
      <Turnstile
        key={remountKey}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={(token) => onTokenChange(token)}
        onExpire={() => onTokenChange(null)}
        onError={() => onTokenChange(null)}
        options={{ theme: "light", size: "flexible" }}
      />
    </Box>
  );
}
