import { Box, IconButton, Slider, Stack, Typography } from "@mui/material";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type VoiceAnswerPlayerProps = {
  src: string;
  durationSec?: number | null;
  style?: CSSProperties;
};

function isLocalBlobUrl(src: string): boolean {
  return src.startsWith("blob:");
}

function formatTimer(totalSec: number): string {
  const safe = Number.isFinite(totalSec) && totalSec > 0 ? Math.floor(totalSec) : 0;
  const mm = String(Math.floor(safe / 60)).padStart(2, "0");
  const ss = String(safe % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/** Mirrors astrologer voice player behavior: duration fallback + controlled timeline. */
export default function VoiceAnswerPlayer({ src, durationSec, style }: VoiceAnswerPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackSrc, setPlaybackSrc] = useState<string | null>(
    isLocalBlobUrl(src) ? src : null
  );
  const [playing, setPlaying] = useState(false);
  const [positionSec, setPositionSec] = useState(0);
  const [elementDurationSec, setElementDurationSec] = useState(0);

  useEffect(() => {
    if (isLocalBlobUrl(src)) {
      setPlaybackSrc(src);
      return;
    }

    let blobUrl: string | null = null;
    let cancelled = false;
    setPlaybackSrc(null);

    void (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error("audio fetch failed");
        const blob = await res.blob();
        if (cancelled) return;
        blobUrl = URL.createObjectURL(blob);
        setPlaybackSrc(blobUrl);
      } catch {
        if (!cancelled) setPlaybackSrc(src);
      }
    })();

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [src]);

  useEffect(() => {
    if (!playbackSrc) return;
    const audio = new Audio(playbackSrc);
    audio.preload = "auto";
    audioRef.current = audio;
    setPlaying(false);
    setPositionSec(0);
    setElementDurationSec(0);

    const syncDuration = () => {
      const d = audio.duration;
      if (Number.isFinite(d) && d > 0) setElementDurationSec(d);
    };
    const onTime = () => setPositionSec(audio.currentTime || 0);
    const onEnded = () => {
      setPlaying(false);
      setPositionSec(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("canplaythrough", syncDuration);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("canplaythrough", syncDuration);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [playbackSrc]);

  if (!playbackSrc) {
    return (
      <Box
        aria-hidden
        sx={{
          width: "100%",
          height: 40,
          borderRadius: 999,
          bgcolor: "action.hover",
          animation: "pulse 1.5s ease-in-out infinite",
          ...style,
        }}
      />
    );
  }

  const effectiveDurationSec = Math.max(durationSec ?? 0, elementDurationSec);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    if (effectiveDurationSec > 0 && positionSec >= effectiveDurationSec) {
      audio.currentTime = 0;
      setPositionSec(0);
    }
    void audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const onSeek = (_: Event, value: number | number[]) => {
    const audio = audioRef.current;
    if (!audio || effectiveDurationSec <= 0) return;
    const next = Array.isArray(value) ? value[0] : value;
    audio.currentTime = next;
    setPositionSec(next);
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 999,
        bgcolor: "action.hover",
        px: 1.5,
        py: 0.5,
        ...style,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={togglePlay} size="small" aria-label={playing ? "Pause" : "Play"}>
          {playing ? <PauseRounded fontSize="small" /> : <PlayArrowRounded fontSize="small" />}
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Slider
            min={0}
            max={effectiveDurationSec > 0 ? effectiveDurationSec : 1}
            value={Math.min(positionSec, effectiveDurationSec || 1)}
            onChange={onSeek}
            size="small"
            sx={{ py: 0 }}
          />
          <Stack direction="row" justifyContent="space-between" sx={{ px: 0.5, mt: -0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {formatTimer(positionSec)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimer(effectiveDurationSec)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
