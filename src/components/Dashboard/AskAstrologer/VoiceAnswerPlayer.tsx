import { Box } from "@mui/material";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type VoiceAnswerPlayerProps = {
  src: string;
  style?: CSSProperties;
};

function isLocalBlobUrl(src: string): boolean {
  return src.startsWith("blob:");
}

/** Remote audio is fetched as a blob so native controls show duration before first play. */
export default function VoiceAnswerPlayer({ src, style }: VoiceAnswerPlayerProps) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playbackSrc, setPlaybackSrc] = useState<string | null>(
    isLocalBlobUrl(src) ? src : null
  );

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
    const audio = ref.current;
    if (!audio || !playbackSrc) return;

    audio.preload = "auto";
    const resetPosition = () => {
      if (audio.currentTime > 0 && audio.paused) {
        audio.currentTime = 0;
      }
    };

    audio.addEventListener("loadedmetadata", resetPosition);
    audio.addEventListener("canplay", resetPosition);
    audio.load();

    return () => {
      audio.removeEventListener("loadedmetadata", resetPosition);
      audio.removeEventListener("canplay", resetPosition);
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

  return (
    <audio
      ref={ref}
      key={playbackSrc}
      controls
      preload="auto"
      src={playbackSrc}
      style={{ width: "100%", ...style }}
    />
  );
}
