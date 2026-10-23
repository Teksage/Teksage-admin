import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { callAPI } from "../../../api/crudFactory";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import type { AskAstrologerItem } from "../../../api/askAstrologerAdmin";

type Props = {
  data: AskAstrologerItem;
  onUpdated: (next: {
    rating: number | null;
    feedback: string | null;
    review_status: string | null;
  }) => void;
};

export function AskReviewModerationSection({ data, onUpdated }: Props) {
  const [editRating, setEditRating] = useState<number | "">(data.rating ?? "");
  const [editFeedback, setEditFeedback] = useState(data.feedback ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setEditRating(data.rating ?? "");
    setEditFeedback(data.feedback ?? "");
  }, [data.rating, data.feedback, data.review_status]);

  if (data.rating == null && !data.review_status) {
    return null;
  }

  const save = async (review_status: "approved" | "rejected" | "pending") => {
    setBusy(true);
    setMsg(null);
    try {
      const body: Record<string, unknown> = { review_status };
      if (editRating !== "") body.rating = Number(editRating);
      body.feedback = editFeedback;
      const res = await callAPI({
        endpoint: `api/admin/ask-astrologer/${data.id}/review`,
        method: "put",
        data: body,
      });
      const payload = res?.data ?? {};
      onUpdated({
        rating: payload.rating ?? data.rating ?? null,
        feedback: payload.feedback ?? editFeedback ?? null,
        review_status: payload.review_status ?? review_status,
      });
      setMsg(
        review_status === "approved"
          ? "Review approved."
          : review_status === "rejected"
            ? "Review rejected."
            : "Review saved as pending."
      );
    } catch (err: any) {
      const text =
        typeof err?.message === "string" && err.message.trim()
          ? err.message
          : err?.response?.data?.detail || "Failed to update review";
      setMsg(text);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardSectionPaper title="Customer review">
      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
        Status: {(data.review_status || "none").toUpperCase()}
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <TextField
          label="Rating (1–5)"
          type="number"
          size="small"
          value={editRating}
          onChange={(e) => {
            const v = e.target.value;
            setEditRating(v === "" ? "" : Number(v));
          }}
          inputProps={{ min: 1, max: 5 }}
        />
        <TextField
          label="Feedback"
          size="small"
          multiline
          minRows={2}
          value={editFeedback}
          onChange={(e) => setEditFeedback(e.target.value)}
        />
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color="success"
            disabled={busy}
            onClick={() => void save("approved")}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={busy}
            onClick={() => void save("rejected")}
          >
            Reject
          </Button>
          <Button
            variant="outlined"
            disabled={busy}
            onClick={() => void save("pending")}
          >
            Keep pending
          </Button>
        </Box>
        {msg ? (
          <Alert severity={msg.toLowerCase().includes("fail") ? "error" : "success"}>
            {msg}
          </Alert>
        ) : null}
      </Stack>
    </DashboardSectionPaper>
  );
}
