import NavBar from "../functionalities/NavBar";
import SongPlayer from "../functionalities/SongPlayer";
import { Link } from "react-router-dom";

function PlayList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
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

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-2xl font-semibold mb-6 font-['Tektur',sans-serif]">
              Liked Songs
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-white/10"></div>
                    <div>
                      <div className="font-medium text-lg">Song Title</div>
                      <div className="text-sm text-zinc-400">
                        by Singer Name
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium cursor-pointer hover:bg-zinc-200 transition">
                      Play
                    </div>
                    <div className="text-red-500 hover:text-red-400 cursor-pointer font-bold text-lg">
                      &times;
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-2xl font-semibold mb-6 font-['Tektur',sans-serif]">
              Favorite Singers
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="relative w-full aspect-square rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden cursor-pointer group"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://via.placeholder.com/300')`,
                    }}
                  ></div>

                  <div className="absolute bottom-2 left-2 text-white font-medium z-10">
                    Singer Name
                  </div>

                  <div className="absolute inset-0 bg-black/70 text-white p-4 flex items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    This is the singer description. Highlight achievements or
                    favorite songs here.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SongPlayer />
    </div>
  );
}

export default PlayList;
