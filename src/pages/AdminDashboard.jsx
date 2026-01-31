import { Link } from "react-router-dom";
import NavBar from "../functionalities/NavBar";
import { getUser, isLoggedIn } from "../lib/auth";

const ADMIN_LINKS = [
  { to: "/admin/reports", label: "Reports & issues", description: "Review all reports and moderate content." },
  { to: "/admin/artists", label: "Reported artists", description: "Artists with reports; deactivate if needed." },
  { to: "/admin/music", label: "Reported music", description: "Tracks with reports; remove if needed." },
  { to: "/admin/users", label: "Users", description: "View user emails and reset passwords." },
];

export default function AdminDashboard() {
  const user = getUser();
  const canUse = isLoggedIn() && user?.role === "admin";

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <div className="text-4xl font-bold font-['Tektur',sans-serif]">Admin</div>
          <div className="mt-3 text-zinc-400 max-w-2xl">
            Moderate content, review reports, and manage artists and music.
          </div>
        </div>

        {!canUse ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
            This area is for admin accounts. <Link className="underline" to="/signin">Sign in</Link> as an admin.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADMIN_LINKS.map(({ to, label, description }) => (
              <Link
                key={to}
                to={to}
                className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:bg-white/10 transition block"
              >
                <div className="text-xl font-semibold font-['Tektur',sans-serif] mb-2">{label}</div>
                <div className="text-sm text-zinc-400">{description}</div>
                <div className="mt-4 text-sm text-white/60">Open →</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
