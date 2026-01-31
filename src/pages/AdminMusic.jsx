import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../functionalities/NavBar";
import { apiFetch } from "../lib/api";
import { getUser, isLoggedIn } from "../lib/auth";

export default function AdminMusic() {
  const user = getUser();
  const canUse = isLoggedIn() && user?.role === "admin";

  const [music, setMusic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [busyId, setBusyId] = useState(null);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const load = async () => {
    if (!canUse) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const list = await apiFetch("/api/admin/music/reported").catch(() => []);
      setMusic(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.message || "Failed to load music");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [canUse]);

  const remove = async (musicId) => {
    if (!musicId) return;
    setBusyId(musicId);
    try {
      await apiFetch(`/api/admin/music/${musicId}/remove`, { method: "PATCH" });
      flash("Track removed");
      await load();
    } catch (e) {
      flash(e?.message || "Failed to remove");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-4xl font-bold font-['Tektur',sans-serif]">Reported music</div>
            <div className="mt-3 text-zinc-400 max-w-2xl">
              Tracks with one or more reports. Remove if needed.
            </div>
          </div>
          <Link
            to="/admin"
            className="rounded-2xl bg-white/5 border border-white/10 px-5 py-3 text-sm hover:bg-white/10 transition"
          >
            ← Admin
          </Link>
        </div>

        {toast && (
          <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-zinc-200">
            {toast}
          </div>
        )}
        {!canUse && (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            Admin only. <Link className="underline" to="/signin">Sign in</Link> as admin.
          </div>
        )}
        {canUse && error && (
          <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
            {error}
          </div>
        )}
        {canUse && isLoading && (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            Loading...
          </div>
        )}
        {canUse && !isLoading && music.length === 0 && (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            No music with reports.
          </div>
        )}
        {canUse && !isLoading && music.length > 0 && (
          <div className="grid gap-6">
            {music.map((m) => (
              <div
                key={m?._id}
                className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col md:flex-row gap-5"
              >
                <div
                  className="h-24 w-24 rounded-2xl bg-white/10 shrink-0"
                  style={{
                    backgroundImage: m?.musicImage ? `url(${m.musicImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-semibold truncate">{m?.title || "Untitled"}</div>
                  <div className="text-sm text-zinc-400 truncate">
                    by {m?.uploadedBy?.details?.username || "Unknown"}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Reports: {Number(m?.reports || 0)} · Status: {m?.status || "—"}
                  </div>
                  {m?._id && (
                    <Link
                      to={`/track/${m._id}`}
                      className="inline-block mt-2 text-sm text-white/70 hover:text-white transition"
                    >
                      View track →
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(m._id)}
                  disabled={busyId === m._id || m?.status === "removed"}
                  className="rounded-xl bg-red-500/15 border border-red-500/25 px-4 py-2 text-sm hover:bg-red-500/20 transition disabled:opacity-50 self-start md:self-center"
                >
                  {busyId === m._id ? "Working..." : m?.status === "removed" ? "Removed" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
