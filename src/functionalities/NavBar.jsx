import { Link } from 'react-router-dom'

function NavBar() {
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
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition cursor-pointer">
            <Link to="/signin">Sign In</Link>
          </div>
        </div>
      </div> 
  )
}

export default NavBar