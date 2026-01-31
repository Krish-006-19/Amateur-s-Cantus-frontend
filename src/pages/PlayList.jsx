import NavBar from "../functionalities/NavBar";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { getUser, isLoggedIn } from "../lib/auth";
import { usePlayer, sortByPopular } from "../ContextAPI/PlayerContext";

function PlayList() {
  const user = getUser();
  const consumerId = user?.role === "artist" ? user?.profiles?.consumer : user?.profile?.id;
  const canUse = isLoggedIn() && (user?.role === "consumer" || user?.role === "artist") && Boolean(consumerId);

  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { playSong } = usePlayer();

  const favoriteSingers = (() => {
    const map = new Map();
    for (const s of playlist || []) {
      const a = s?.uploadedBy;
      const id = a?._id;
      if (!id) continue;
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: a?.details?.username || "Unknown",
          image: a?.details?.profileImage || null,
        });
      }
    }
    return Array.from(map.values());
  })();

  const queuePlaylist = useMemo(() => sortByPopular(playlist), [playlist]);

  const load = async () => {
    if (!canUse) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const consumer = await apiFetch(`/api/consumer/${consumerId}`);
      const list = Array.isArray(consumer?.playlist) ? consumer.playlist : [];
      setPlaylist(list);
    } catch (e) {
      setError(e?.message || "Failed to load playlist");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (musicId) => {
    if (!canUse) return;
    try {
      await apiFetch(`/api/consumer/playlist/${consumerId}/${musicId}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e?.message || "Failed to remove");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-4xl font-bold font-['Tektur',sans-serif]">
              My Playlist
            </div>
            <div className="mt-3 text-zinc-400 max-w-2xl">
              Manage your liked songs and favorite singers.
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition text-sm font-medium">
              <Link to="/explore">+ Add Song</Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!canUse && (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            Playlist is for listener accounts. <Link className="underline" to="/signin">Sign in</Link> as a consumer.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-2xl font-semibold mb-6 font-['Tektur',sans-serif]">
              Liked Songs
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-zinc-300">Loading...</div>
              ) : playlist.length === 0 ? (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-zinc-300">No songs in playlist yet.</div>
              ) : (
                playlist.map((song) => (
                  <div
                    key={song?._id}
                    className="flex items-center justify-between rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 rounded-xl bg-white/10"
                        style={{
                          backgroundImage: song?.musicImage ? `url(${song.musicImage})` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div>
                        <div className="font-medium text-lg truncate max-w-56">{song?.title || "Untitled"}</div>
                        <div className="text-sm text-zinc-400 truncate max-w-56">
                          by {song?.uploadedBy?.details?.username || "Unknown"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playSong(song, queuePlaylist, { mode: "playlist" })}
                        className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium cursor-pointer hover:bg-zinc-200 transition"
                      >
                        Play
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(song?._id)}
                        className="text-red-500 hover:text-red-400 font-bold text-lg"
                        aria-label="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="text-2xl font-semibold mb-6 font-['Tektur',sans-serif]">
              Favorite Singers
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-zinc-300">Loading...</div>
              ) : favoriteSingers.length === 0 ? (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-zinc-300">
                  No singers yet.
                </div>
              ) : (
                favoriteSingers.map((s) => (
                  <div
                    key={s.id}
                    className="relative w-full aspect-square rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: s.image ? `url(${s.image})` : undefined,
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-2 left-2 text-white font-medium z-10 truncate max-w-[90%]">
                      {s.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayList;
