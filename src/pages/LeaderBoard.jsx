import NavBar from "../functionalities/NavBar";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { usePlayer } from "../ContextAPI/PlayerContext";

function LeaderBoard() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { playSong } = usePlayer();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const list = await apiFetch("/api/music");
        if (!isMounted) return;
        setSongs(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!isMounted) return;
        if (e?.status === 404) {
          setSongs([]);
          return;
        }
        setError(e?.message || "Failed to load leaderboard");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const rankings = useMemo(() => {
    const byArtist = new Map();
    for (const s of songs || []) {
      const artistId = s?.uploadedBy?._id || "unknown";
      const artistName = s?.uploadedBy?.details?.username || "Unknown";
      const plays = Number(s?.plays || 0);
      const likes = Number(s?.likes || 0);
      const songScore = plays + likes * 2;

      const existing = byArtist.get(artistId);
      if (!existing) {
        byArtist.set(artistId, {
          artistId,
          artistName,
          score: songScore,
          bestSong: s,
          bestSongScore: songScore,
        });
      } else {
        existing.score += songScore;
        if (songScore > Number(existing.bestSongScore || 0)) {
          existing.bestSong = s;
          existing.bestSongScore = songScore;
        }
      }
    }

    const list = Array.from(byArtist.values());
    list.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    return list.slice(0, 20);
  }, [songs]);

  const queueFromLeaderboard = useMemo(() => {
    return (rankings || []).map((r) => r?.bestSong).filter(Boolean);
  }, [rankings]);

  const handlePlaySong = async (song) => {
    if (!song?._id) return;
    playSong(song, queueFromLeaderboard);
    try {
      await apiFetch(`/api/music/${song._id}/play`, { method: "PATCH" });
    } catch {
      // non-blocking
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <div className="text-4xl font-bold font-['Tektur',sans-serif]">
            Community Leaderboard
          </div>
          <div className="mt-3 text-zinc-400 max-w-2xl">
            Discover voices the community loves. Rankings are based on genuine
            engagement — not trends.
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          <div className="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition">
            This Week
          </div>
          <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/20 transition">
            This Month
          </div>
          <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/20 transition">
            All Time
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-8 text-zinc-300">Loading leaderboard...</div>
        ) : rankings.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-8 text-zinc-300">No data yet.</div>
        ) : (
        <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-5 text-sm text-zinc-400 border-b border-white/10">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Artist</div>
            <div className="col-span-4 hidden md:block">Top Performance</div>
            <div className="col-span-2 text-right">Score</div>
          </div>

          {rankings.map((row, idx) => (
            <div
              key={row.artistId}
              className="grid grid-cols-12 px-8 py-6 items-center border-b border-white/5 hover:bg-white/5 transition"
            >
              <div className="col-span-1 text-lg font-semibold">{idx + 1}</div>

              <div className="col-span-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10"></div>
                <div>
                  <div className="font-medium">{row.artistName}</div>
                  <div className="text-xs text-zinc-400">@{row.artistName}</div>
                </div>
              </div>

              <div className="col-span-4 hidden md:block text-zinc-400 text-sm">
                <button
                  type="button"
                  onClick={() => handlePlaySong(row.bestSong)}
                  className="text-left hover:text-white transition truncate max-w-full"
                  title={row?.bestSong?.title || "Untitled"}
                >
                  {row?.bestSong?.title || "Untitled"}
                </button>
              </div>

              <div className="col-span-2 text-right font-semibold">
                {Number(row.score || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="mt-10 text-sm text-zinc-500 max-w-3xl">
          Leaderboard scores are calculated using listener engagement,
          consistency, and community feedback. Artificial boosting or
          manipulation may result in penalties.
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
