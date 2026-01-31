import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../functionalities/NavBar";
import { apiFetch } from "../lib/api";
import { getUser, isLoggedIn } from "../lib/auth";

export default function AdminUsers() {
  const user = getUser();
  const canUse = isLoggedIn() && user?.role === "admin";

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [resetFor, setResetFor] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    if (!canUse) return;

    let alive = true;
    setIsLoading(true);
    setError("");

    apiFetch("/api/admin/users")
      .then((data) => {
        if (!alive) return;
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load users");
      })
      .finally(() => {
        if (!alive) return;
        setIsLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [canUse]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const email = String(u?.email || "").toLowerCase();
      const username = String(u?.username || "").toLowerCase();
      const role = String(u?.role || "").toLowerCase();
      return email.includes(q) || username.includes(q) || role.includes(q);
    });
  }, [users, query]);

  const startReset = (u) => {
    setResetMsg("");
    setNewPassword("");
    setResetFor(u);
  };

  const doReset = async () => {
    if (!resetFor?._id) return;
    setResetMsg("");
    if (!newPassword || newPassword.length < 6) {
      setResetMsg("Password must be at least 6 characters");
      return;
    }

    try {
      setIsResetting(true);
      await apiFetch(`/api/admin/users/${resetFor._id}/password`, {
        method: "PATCH",
        body: { password: newPassword },
      });
      setResetMsg("Password reset successfully");
      setNewPassword("");
    } catch (e) {
      setResetMsg(e?.message || "Password reset failed");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <div className="text-4xl font-bold font-['Tektur',sans-serif]">Users</div>
            <div className="mt-3 text-zinc-400 max-w-2xl">
              Admin can view user emails and manage accounts. Passwords are stored hashed and cannot be viewed; you can only reset them.
            </div>
          </div>
          <Link to="/admin" className="text-sm text-white/70 hover:text-white underline">
            Back to Admin
          </Link>
        </div>

        {!canUse ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            This area is for admin accounts. <Link className="underline" to="/signin">Sign in</Link> as an admin.
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email / username / role"
                className="w-full sm:max-w-md rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
              />
              <div className="text-sm text-zinc-400">
                {isLoading ? "Loading…" : `${filtered.length} users`}
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200 mb-6">
                {error}
              </div>
            )}

            <div className="rounded-4xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-zinc-300">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Username</th>
                      <th className="text-left font-medium px-4 py-3">Email</th>
                      <th className="text-left font-medium px-4 py-3">Role</th>
                      <th className="text-left font-medium px-4 py-3">Status</th>
                      <th className="text-right font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u._id} className="border-t border-white/10">
                        <td className="px-4 py-3 text-zinc-100">{u.username}</td>
                        <td className="px-4 py-3 text-zinc-300">{u.email}</td>
                        <td className="px-4 py-3 text-zinc-300">{u.role}</td>
                        <td className="px-4 py-3 text-zinc-300">{u.status}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => startReset(u)}
                            className="rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 text-xs text-zinc-100"
                          >
                            Reset password
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!isLoading && filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {resetFor && (
              <div className="mt-8 rounded-4xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">Reset password</div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {resetFor.username} — {resetFor.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResetFor(null)}
                    className="text-sm text-white/70 hover:text-white underline"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    className="w-full sm:max-w-sm rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
                  />
                  <button
                    type="button"
                    disabled={isResetting}
                    onClick={doReset}
                    className="rounded-xl bg-white text-black px-4 py-3 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isResetting ? "Resetting…" : "Reset"}
                  </button>
                </div>

                {resetMsg && (
                  <div className="mt-3 text-sm text-zinc-300">
                    {resetMsg}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
