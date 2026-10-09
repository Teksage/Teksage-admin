import React from "react";
import { Box, TextField, Typography } from "@mui/material";

export const MARATHON_CATEGORIES = ["Career", "Wealth", "Marriage & Relationships", "Health", "All"];
export const SLOT_MS = 10 * 60 * 1000;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function splitLocal(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { date: "", time: "" };
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

export function localDate(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

export function formatDay(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatClock(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

export type MarathonPhase = {
  label: string;
  color: "default" | "info" | "success" | "warning" | "error";
};

export function marathonPhase(row: {
  status: string;
  ended_at?: string | null;
  starts_at: string;
  ends_at: string;
}): MarathonPhase {
  const now = Date.now();
  const start = new Date(row.starts_at).getTime();
  const end = new Date(row.ends_at).getTime();
  if (row.status === "draft") return { label: "Draft", color: "default" };
  if (row.status === "ended" || row.ended_at) return { label: "Ended by admin", color: "error" };
  if (!Number.isNaN(start) && !Number.isNaN(end) && now >= start && now <= end) {
    return { label: "Ongoing", color: "success" };
  }
  if (!Number.isNaN(end) && now > end) return { label: "Completed successfully", color: "success" };
  const eventDay = new Date(row.starts_at);
  eventDay.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (today.getTime() >= eventDay.getTime()) return { label: "Booking closed", color: "warning" };
  return { label: "Upcoming", color: "info" };
}

export function formatWhen(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function LabeledField({
  label,
  stack,
  ...props
}: { label: string; stack?: boolean } & React.ComponentProps<typeof TextField>) {
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>
        {label}
      </Typography>
      <TextField {...props} size="small" fullWidth />
    </Box>
  );
}
