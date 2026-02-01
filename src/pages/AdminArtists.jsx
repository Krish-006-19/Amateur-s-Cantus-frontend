import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../functionalities/NavBar";
import { apiFetch } from "../lib/api";
import { getUser, isLoggedIn } from "../lib/auth";

export default function AdminArtists() {
  const user = getUser();
  const canUse = isLoggedIn() && user?.role === "admin";

  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [busyId, setBusyId] = useState(null);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const load = useCallback(async () => {
    if (!canUse) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const list = await apiFetch("/api/admin/artists/reported").catch(() => []);
      setArtists(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.message || "Failed to load artists");
    } finally {
      setIsLoading(false);
    }
  }, [canUse]);

  useEffect(() => {
    load();
  }, [load]);

  const deactivate = async (artistId) => {
    if (!artistId) return;
    setBusyId(artistId);
    try {
      await apiFetch(`/api/admin/artists/${artistId}/deactivate`, { method: "PATCH" });
      flash("Artist deactivated");
      await load();
    } catch (e) {
      flash(e?.message || "Failed to deactivate");
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
            <div className="text-4xl font-bold font-['Tektur',sans-serif]">Reported artists</div>
            <div className="mt-3 text-zinc-400 max-w-2xl">
              Artists with one or more reports. Deactivate if needed.
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
        {canUse && !isLoading && artists.length === 0 && (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            No artists with reports.
          </div>
        )}
        {canUse && !isLoading && artists.length > 0 && (
          <div className="grid gap-6">
            {artists.map((a) => (
              <div
                key={a?._id}
                className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center gap-5"
              >
                <div
                  className="h-20 w-20 rounded-2xl bg-white/10 shrink-0"
                  style={{
                    backgroundImage: a?.details?.profileImage ? `url(${a.details.profileImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex-1">
                  <div className="text-xl font-semibold truncate">{a?.details?.username || "Unknown"}</div>
                  <div className="text-sm text-zinc-400 mt-1">
                    Reports: {Number(a?.reports || 0)} · Strikes: {Number(a?.policyStrikes || 0)} · Status: {a?.status || "—"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deactivate(a._id)}
                  disabled={busyId === a._id || a?.status === "deactivated"}
                  className="rounded-xl bg-red-500/15 border border-red-500/25 px-4 py-2 text-sm hover:bg-red-500/20 transition disabled:opacity-50"
                >
                  {busyId === a._id ? "Working..." : a?.status === "deactivated" ? "Deactivated" : "Deactivate"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
