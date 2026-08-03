/** WhatsApp 24h customer-care session helpers (from last inbound). */

const SESSION_MS = 24 * 60 * 60 * 1000;

export type SessionStatus = {
  active: boolean;
  msLeft: number;
  label: string;
  urgency: "ok" | "soon" | "inactive";
};

export function getSessionStatus(
  lastInboundAt: string | null | undefined,
  nowMs = Date.now()
): SessionStatus {
  if (!lastInboundAt) {
    return { active: false, msLeft: 0, label: "inactive", urgency: "inactive" };
  }
  const start = Date.parse(lastInboundAt);
  if (Number.isNaN(start)) {
    return { active: false, msLeft: 0, label: "inactive", urgency: "inactive" };
  }
  const msLeft = start + SESSION_MS - nowMs;
  if (msLeft <= 0) {
    return { active: false, msLeft: 0, label: "inactive", urgency: "inactive" };
  }
  return {
    active: true,
    msLeft,
    label: formatRemaining(msLeft),
    urgency: msLeft <= 2 * 60 * 60 * 1000 ? "soon" : "ok",
  };
}

function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h >= 1) return `${h}h ${m}m left`;
  if (m >= 1) return `${m}m left`;
  return "<1m left";
}
