import { useEffect, useMemo, useRef, useState } from "react";

/* eslint-disable react-hooks/set-state-in-effect */

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SongPlayer({
  title,
  singer,
  cover,
  audioUrl,
  autoPlay = false,
  playSignal = 0,
  onEnded,
  onNext,
  onPrev,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);

  const percent = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.preload = "metadata";

    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const onTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioUrl) {
      audio.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    if (audio.src !== audioUrl) {
      audio.pause();
      setIsPlaying(false);
      audio.src = audioUrl;
      audio.currentTime = 0;
      setCurrentTime(0);
      if (autoPlay) setIsPlaying(true);
    }
  }, [audioUrl, autoPlay]);

  useEffect(() => {
    if (!audioUrl) return;
    setIsPlaying(true);
  }, [playSignal, audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioUrl) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, audioUrl]);

  const seekTo = (pct) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = (pct / 100) * duration;
    audio.currentTime = next;
    setCurrentTime(next);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-t border-white/10 px-6 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-6">

        {/* LEFT — Song Info */}
        <div className="flex items-center gap-4 min-w-65">
          <div
            className="h-14 w-14 rounded-lg bg-white/10 shrink-0"
            style={{
              backgroundImage: cover ? `url(${cover})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="leading-tight">
            <div className="text-sm font-medium truncate max-w-45">
              {title}
            </div>
            <div className="text-xs text-zinc-400 truncate max-w-45">
              {singer}
            </div>
          </div>
        </div>

{/* CENTER — Controls */}
  <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">

  {/* Control Buttons */}
  <div className="flex items-center gap-6">

    {/* Previous */}
    <div
      role="button"
      onClick={() => onPrev?.()}
      className="cursor-pointer text-zinc-400 hover:text-white transition"
      aria-label="Previous"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19V5h2v14H6zm3.5-7l8.5 7V5l-8.5 7z" />
      </svg>
    </div>

    {/* Play / Pause */}
    <div
      onClick={() => {
        if (!audioUrl) return;
        setIsPlaying(!isPlaying);
      }}
      className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-black cursor-pointer hover:scale-105 transition"
    >
      {isPlaying ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </div>

    {/* Next */}
    <div
      role="button"
      onClick={() => onNext?.()}
      className="cursor-pointer text-zinc-400 hover:text-white transition"
      aria-label="Next"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 5v14h2V5h-2zM6 19l8.5-7L6 5v14z" />
      </svg>
    </div>

  </div>

  {/* Progress Bar */}
  <div className="flex items-center gap-3 w-full text-xs text-zinc-400">
    <span>{formatTime(currentTime)}</span>
    <input
      type="range"
      min="0"
      max="100"
      value={percent}
      onChange={(e) => {
        const v = Number(e.target.value);
        seekTo(v);
      }}
      className="flex-1 h-1 rounded-full bg-white/20 accent-white cursor-pointer"
    />
    <span>{formatTime(duration)}</span>
  </div>

</div>


        {/* RIGHT — Utilities (placeholder) */}
        <div className="flex items-center gap-4 min-w-30 justify-end text-zinc-400">
          {/* <svg className="h-5 w-5 cursor-pointer hover:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 10h18v2H3z" />
          </svg>
          <svg className="h-5 w-5 cursor-pointer hover:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 9v6h4l5 5V4L9 9H5z" />
          </svg> */}
        </div>

      </div>
    </div>
  );
}