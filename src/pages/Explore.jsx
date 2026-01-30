import NavBar from "../functionalities/NavBar";
import { Link } from "react-router-dom";
import SongPlayer from "../functionalities/SongPlayer";

function Explore() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-4xl font-bold font-['Tektur',sans-serif]">
              Explore Voices
            </div>
            <div className="mt-3 text-zinc-400 max-w-2xl">
              Discover honest performances from amateur singers around the
              world.
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition text-sm font-medium">
              <Link to="/playlist">Playlist</Link>
            </div>
          </div>
        </div>

        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by song, artist, or genre"
            className="flex-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 outline-none focus:border-white/30 text-sm"
          />
          <div className="flex gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition text-sm">
              Latest
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/20 transition text-sm">
              Popular
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/20 transition text-sm">
              Genres
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition"
            >
              <div className="h-40 rounded-xl bg-white/10 mb-5"></div>

              <div className="mb-4">
                <div className="font-medium text-lg">Song Title</div>
                <div className="text-sm text-zinc-400">by Singer Name</div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <div>Acoustic</div>
                <div>2.3k listens</div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium cursor-pointer hover:bg-zinc-200 transition">
                  Play
                </div>
                <div className="text-xs text-zinc-500">3 min</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="px-10 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition">
            Load More
          </div>
        </div>
      </div>
      <SongPlayer />
    </div>
  );
}

export default Explore;
