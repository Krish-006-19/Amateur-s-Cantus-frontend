import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../functionalities/NavBar";
import { apiFetch } from "../lib/api";
import { getUser, isLoggedIn } from "../lib/auth";

function formatDate(value) {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

const STATUS_LABELS = {
  pending: "Pending",
  reviewed: "Reviewed",
  dismissed: "Dismissed",
  approved: "Approved (edit required)",
};

export default function Reports() {
  const user = getUser();
  const canUse = isLoggedIn() && (user?.role === "consumer" || (user?.role === "artist" && user?.profiles?.consumer));

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canUse) {
      setIsLoading(false);
      return;
    }
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const list = await apiFetch("/api/report/my");
        setReports(Array.isArray(list) ? list : []);
      } catch (e) {
        if (e?.status === 404) {
          setReports([]);
          return;
        }
        setError(e?.message || "Failed to load reports");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [canUse]);

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="text-4xl font-bold font-['Tektur',sans-serif]">My Reports</div>
          <div className="mt-3 text-zinc-400 max-w-2xl">
            Reports you have submitted. You can report songs from their track page.
          </div>
        </div>

        {!canUse && (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            Sign in to view your reports. <Link className="underline" to="/signin">Sign in</Link>
          </div>
        )}

        {canUse && error && (
          <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {canUse && isLoading && (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            Loading reports...
          </div>
        )}

        {canUse && !isLoading && reports.length === 0 && (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            You have not submitted any reports. Report a song from its track page.
          </div>
        )}

        {canUse && !isLoading && reports.length > 0 && (
          <div className="grid gap-6">
            {reports.map((r) => {
              const id = r?._id;
              const music = r?.music;
              const artist = r?.reportedAgainst;
              const title = music?.title || "Untitled";
              const cover = music?.musicImage;
              const artistName = artist?.details?.username || "Unknown";
              const status = r?.status || "pending";

              return (
                <div key={id} className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex flex-col md:flex-row gap-5">
                    <div
                      className="h-24 w-24 rounded-2xl bg-white/10 shrink-0"
                      style={{
                        backgroundImage: cover ? `url(${cover})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xl font-semibold truncate">{title}</div>
                          <div className="mt-1 text-sm text-zinc-400 truncate">by {artistName}</div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          status === "pending" ? "bg-amber-500/20 text-amber-200" :
                          status === "approved" ? "bg-red-500/20 text-red-200" :
                          "bg-zinc-500/20 text-zinc-300"
                        }`}>
                          {STATUS_LABELS[status] || status}
                        </span>
                      </div>
                      <div className="mt-4 text-sm text-zinc-400">
                        <div><span className="text-zinc-500">Reason:</span> {r?.reason || ""}</div>
                        {r?.proof ? <div><span className="text-zinc-500">Proof:</span> {r.proof}</div> : null}
                        <div className="text-xs text-zinc-500 mt-2">{formatDate(r?.createdAt)}</div>
                      </div>
                      {music?._id && (
                        <Link
                          to={`/track/${music._id}`}
                          className="mt-3 inline-block text-sm text-white hover:underline"
                        >
                          View track →
                        </Link>
                      )}
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
