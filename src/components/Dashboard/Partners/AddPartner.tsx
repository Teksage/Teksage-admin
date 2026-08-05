import { useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";

export default function AddPartner() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [youtube, setYoutube] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await callAPI({
        endpoint: "/api/admin/partners",
        method: "post",
        data: {
          name,
          email,
          password,
          mobile_number: mobile || undefined,
          youtube_channel_url: youtube || undefined,
        },
      });
      navigate(`/dashboard/partners/view/${res.data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create partner");
    } finally {
      setBusy(false);
    }
  }

  const canSubmit =
    !busy &&
    !!name.trim() &&
    !!email.trim() &&
    password.length >= 6 &&
    password === confirmPassword;

  return (
    <Box sx={{ p: 3, maxWidth: 520 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Add Partner
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Share the login email and password with the partner. They sign in on this
        admin site (Partner password login) to see customers who used their codes.
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Login email"
        margin="normal"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText="Min 6 characters — give this to the partner"
      />
      <TextField
        fullWidth
        label="Confirm password"
        margin="normal"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <TextField
        fullWidth
        label="Mobile (optional)"
        margin="normal"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <TextField
        fullWidth
        label="YouTube channel URL"
        margin="normal"
        value={youtube}
        onChange={(e) => setYoutube(e.target.value)}
      />
      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <Button variant="outlined" onClick={() => navigate("/dashboard/partners")}>
          Cancel
        </Button>
        <Button variant="contained" disabled={!canSubmit} onClick={() => void onSubmit()}>
          Create
        </Button>
      </Box>
    </Box>
  );
}
