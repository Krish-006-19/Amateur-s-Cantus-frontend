import { useEffect, useMemo, useState } from "react";
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

export default function AdminReports() {
  const user = useMemo(() => getUser(), []);
  const canUse = isLoggedIn() && user?.role === "admin";

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [actionById, setActionById] = useState({});
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
      const list = await apiFetch("/api/admin/reports");
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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = async (reportId) => {
    if (!reportId) return;
    setBusyId(reportId);
    try {
      await apiFetch(`/api/admin/reports/${reportId}/dismiss`, { method: "PATCH" });
      flash("Dismissed");
      await load();
    } catch (e) {
      flash(e?.message || "Failed to dismiss");
    } finally {
      setBusyId(null);
    }
  };

  const takeAction = async (reportId) => {
    if (!reportId) return;
    const action = actionById?.[reportId] || "remove_and_strike";
    setBusyId(reportId);
    try {
      await apiFetch(`/api/admin/reports/${reportId}/action`, {
        method: "PATCH",
        body: { action },
      });
      flash("Action applied");
      await load();
    } catch (e) {
      flash(e?.message || "Failed to apply action");
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
            <div className="text-4xl font-bold font-['Tektur',sans-serif]">Admin Reports</div>
            <div className="mt-3 text-zinc-400 max-w-2xl">
              All reports and issues. Review and moderate content. Actions apply only to pending reports.
            </div>
          </div>
          <Link
            to="/admin"
            className="rounded-2xl bg-white/5 border border-white/10 px-5 py-3 text-sm hover:bg-white/10 transition"
          >
            ← Admin
          </Link>
        </div>

        {toast ? (
          <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-zinc-200">{toast}</div>
        ) : null}

        {!canUse ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            This page is for admin accounts. <Link className="underline" to="/signin">Sign in</Link> as an admin.
          </div>
        ) : null}

        {canUse && error ? (
          <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {canUse && isLoading ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">Loading reports...</div>
        ) : null}

        {canUse && !isLoading && reports.length === 0 ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            No reports.
          </div>
        ) : null}

        {canUse && !isLoading && reports.length > 0 ? (
          <div className="grid gap-6">
            {reports.map((r) => {
              const id = r?._id;
              const music = r?.music;
              const artist = r?.reportedAgainst;
              const reporter = r?.reportedBy;
              const status = r?.status || "pending";

              const title = music?.title || "Untitled";
              const cover = music?.musicImage;
              const artistName = artist?.details?.username || "Unknown artist";
              const reporterName = reporter?.details?.username || "Unknown";
              const reporterEmail = reporter?.details?.email || "";

              const busy = busyId === id;
              const isPending = status === "pending";

              const statusClass =
                status === "pending"
                  ? "bg-amber-500/20 text-amber-200"
                  : status === "approved"
                    ? "bg-red-500/20 text-red-200"
                    : status === "dismissed"
                      ? "bg-zinc-500/20 text-zinc-400"
                      : "bg-zinc-500/20 text-zinc-300";

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
                    ></div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xl font-semibold truncate">{title}</div>
                          <div className="mt-1 text-sm text-zinc-400 truncate">by {artistName}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-lg ${statusClass}`}>
                            {status}
                          </span>
                          <span className="text-xs text-zinc-500">{formatDate(r?.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-zinc-200">
                        <div>
                          <span className="text-zinc-400">Reason:</span> {r?.reason || ""}
                        </div>
                        <div>
                          <span className="text-zinc-400">Proof:</span> {r?.proof || ""}
                        </div>
                        <div className="text-xs text-zinc-500">
                          Reported by {reporterName}{reporterEmail ? ` (${reporterEmail})` : ""}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col md:flex-row md:items-center gap-3">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() => dismiss(id)}
                              disabled={busy}
                              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-50"
                            >
                              Dismiss
                            </button>

                            <div className="flex items-center gap-3">
                              <select
                                value={actionById?.[id] || "remove_and_strike"}
                                onChange={(e) => setActionById((m) => ({ ...m, [id]: e.target.value }))}
                                className="px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-zinc-100"
                                disabled={busy}
                              >
                                <option value="remove_and_strike">Remove + Strike</option>
                                <option value="remove_music">Remove Only</option>
                                <option value="strike">Strike Only</option>
                                <option value="flag_for_edit">Require edit (vulgar content)</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => takeAction(id)}
                                disabled={busy}
                                className="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 hover:bg-red-500/20 transition disabled:opacity-50"
                              >
                                {busy ? "Working..." : "Apply"}
                              </button>
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-zinc-500">No actions (report already handled)</span>
                        )}

                        <div className="text-xs text-zinc-500">
                          Report ID: {id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
