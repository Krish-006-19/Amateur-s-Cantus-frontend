import { useState } from "react";

export default function SongPlayer({ title, singer, cover }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // demo value

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-t border-white/10 px-6 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-6">

        {/* LEFT — Song Info */}
        <div className="flex items-center gap-4 min-w-[260px]">
          <div
            className="h-14 w-14 rounded-lg bg-white/10 flex-shrink-0"
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="leading-tight">
            <div className="text-sm font-medium truncate max-w-[180px]">
              {title}
            </div>
            <div className="text-xs text-zinc-400 truncate max-w-[180px]">
              {singer}
            </div>
          </div>
        </div>

{/* CENTER — Controls */}
<div className="flex flex-col items-center gap-2 flex-1 max-w-xl">

  {/* Control Buttons */}
  <div className="flex items-center gap-6">

    {/* Previous */}
    <div className="cursor-pointer text-zinc-400 hover:text-white transition">
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19V5h2v14H6zm3.5-7l8.5 7V5l-8.5 7z" />
      </svg>
    </div>

    {/* Play / Pause */}
    <div
      onClick={() => setIsPlaying(!isPlaying)}
      className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-black cursor-pointer hover:scale-105 transition"
    >
      {isPlaying ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg className="h-5 w-5 ml-[2px]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </div>

    {/* Next */}
    <div className="cursor-pointer text-zinc-400 hover:text-white transition">
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 5v14h2V5h-2zM6 19l8.5-7L6 5v14z" />
      </svg>
    </div>

  </div>

  {/* Progress Bar */}
  <div className="flex items-center gap-3 w-full text-xs text-zinc-400">
    <span>1:12</span>
    <input
      type="range"
      min="0"
      max="100"
      value={progress}
      onChange={(e) => setProgress(e.target.value)}
      className="flex-1 h-1 rounded-full bg-white/20 accent-white cursor-pointer"
    />
    <span>2:14</span>
  </div>

</div>


        {/* RIGHT — Utilities (placeholder) */}
        <div className="flex items-center gap-4 min-w-[120px] justify-end text-zinc-400">
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