import { Link, useNavigate } from 'react-router-dom'
import { clearAuth, getUser, isLoggedIn } from '../lib/auth'

function NavBar() {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isLoggedIn();
  const role = user?.role;

  const logout = () => {
    clearAuth();
    navigate('/signin');
    window.location.reload();
  };

  return (
          <div className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="text-lg font-semibold tracking-wide font-['Tektur',sans-serif]">
            <Link to="/">
            Amateur’s Cantus
            </Link>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-zinc-300">
            <div className="hover:text-white cursor-pointer transition">
              <Link to="/explore">
                Explore
              </Link>
            </div>
            <div className="hover:text-white cursor-pointer transition">
              <Link to="/upload">
                Upload
              </Link>
            </div>
            <div className="hover:text-white cursor-pointer transition">
              <Link to="/leaderboard">
                LeaderBoard
              </Link>
            </div>
            {loggedIn && role === 'consumer' && (
              <div className="hover:text-white cursor-pointer transition">
                <Link to="/playlist">Playlist</Link>
              </div>
            )}
            {loggedIn && role === 'artist' && user?.profiles?.consumer && (
              <div className="hover:text-white cursor-pointer transition">
                <Link to="/playlist">Playlist</Link>
              </div>
            )}
            {loggedIn && (role === 'consumer' || (role === 'artist' && user?.profiles?.consumer)) && (
              <div className="hover:text-white cursor-pointer transition">
                <Link to="/reports">My Reports</Link>
              </div>
            )}
            {loggedIn && role === 'admin' && (
              <div className="hover:text-white cursor-pointer transition">
                <Link to="/admin">Admin</Link>
              </div>
            )}
          </div>
          {loggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="hidden sm:flex items-center gap-2">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="h-8 w-8 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10" />
                )}
                <span className="text-xs text-zinc-400">
                  {user?.username ? user.username : 'Account'} {role ? `(${role})` : ''}
                </span>
              </Link>
              <Link to="/profile" className="sm:hidden text-xs text-zinc-400 hover:text-white">
                Profile
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition cursor-pointer">
              <Link to="/signin">Sign In</Link>
            </div>
          )}
        </div>
      </div> 
  )
}

export default NavBar