import NavBar from "../functionalities/NavBar";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { usePlayer, sortByPopular } from "../ContextAPI/PlayerContext";
import { getUser, isLoggedIn } from "../lib/auth";

function Explore() {
  const user = getUser();
  const canUsePlaylist = isLoggedIn() && (user?.role === "consumer" || (user?.role === "artist" && user?.profiles?.consumer));
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState("latest"); // latest | popular
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
        setError(e?.message || "Failed to load songs");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = Array.isArray(songs) ? [...songs] : [];

    if (q) {
      list = list.filter((s) => {
        const title = String(s?.title || "").toLowerCase();
        const genre = String(s?.genre || "").toLowerCase();
        const artistName = String(s?.uploadedBy?.details?.username || "").toLowerCase();
        return title.includes(q) || genre.includes(q) || artistName.includes(q);
      });
    }

    if (sortMode === "popular") {
      list.sort((a, b) => {
        const scoreA = Number(a?.plays || 0) * 1 + Number(a?.likes || 0) * 2;
        const scoreB = Number(b?.plays || 0) * 1 + Number(b?.likes || 0) * 2;
        return scoreB - scoreA;
      });
    } else {
      list.sort((a, b) => {
        const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
    }

    return list;
  }, [songs, query, sortMode]);

  const queueByPopular = useMemo(() => sortByPopular(songs), [songs]);

  const handlePlay = async (song) => {
    playSong(song, queueByPopular, { mode: "explore" });
    const id = song?._id;
    if (!id) return;
    try {
      const updated = await apiFetch(`/api/music/${id}/play`, { method: "PATCH" });
      const plays = Number(updated?.plays ?? song?.plays ?? 0);
      setSongs((prev) => prev.map((s) => (s?._id === id ? { ...s, plays } : s)));
    } catch {
      // non-blocking
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-4xl font-bold font-['Tektur',sans-serif]">
              Explore Voices
            </div>
            <div className="mt-3 text-zinc-400 max-w-2xl">
              Discover honest performances from amateur singers around the
              world.
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            {canUsePlaylist ? (
              <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition text-sm font-medium">
                <Link to="/playlist">Playlist</Link>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by song, artist, or genre"
            className="flex-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 outline-none focus:border-white/30 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSortMode("latest")}
              className={`px-5 py-3 rounded-2xl border border-white/10 transition text-sm ${
                sortMode === "latest"
                  ? "bg-white/10 backdrop-blur-md hover:bg-white/20"
                  : "bg-white/5 hover:bg-white/20"
              }`}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => setSortMode("popular")}
              className={`px-5 py-3 rounded-2xl border border-white/10 transition text-sm ${
                sortMode === "popular"
                  ? "bg-white/10 backdrop-blur-md hover:bg-white/20"
                  : "bg-white/5 hover:bg-white/20"
              }`}
            >
              Popular
            </button>
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/20 transition text-sm">
              Genres
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            Loading songs...
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            No songs found.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => {
              const id = song?._id;
              const title = song?.title || "Untitled";
              const singer = song?.uploadedBy?.details?.username || "Unknown artist";
              const genre = song?.genre || "Unknown";
              const listens = Number(song?.plays || 0);
              const cover = song?.musicImage;

              return (
                <div
                  key={id}
                  className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition"
                >
                  <div
                    className="h-40 rounded-xl bg-white/10 mb-5"
                    style={{
                      backgroundImage: cover ? `url(${cover})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>

                  <div className="mb-4">
                    <div className="font-medium text-lg truncate">{title}</div>
                    <div className="text-sm text-zinc-400 truncate">by {singer}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <div className="truncate max-w-[50%]">{genre}</div>
                    <div>{listens.toLocaleString()} listens</div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handlePlay(song)}
                      className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium cursor-pointer hover:bg-zinc-200 transition"
                    >
                      Play
                    </button>
                    <div className="text-xs text-zinc-500">
                      {id ? <Link to={`/track/${id}`}>Open</Link> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default Explore;
