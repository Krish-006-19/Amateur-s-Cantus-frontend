import NavBar from "../functionalities/NavBar";
import SongPlayer from "../functionalities/SongPlayer";

function LeaderBoard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <div className="text-4xl font-bold font-['Tektur',sans-serif]">
            Community Leaderboard
          </div>
          <div className="mt-3 text-zinc-400 max-w-2xl">
            Discover voices the community loves. Rankings are based on genuine
            engagement — not trends.
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          <div className="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition">
            This Week
          </div>
          <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/20 transition">
            This Month
          </div>
          <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/20 transition">
            All Time
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-5 text-sm text-zinc-400 border-b border-white/10">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Artist</div>
            <div className="col-span-4 hidden md:block">Top Performance</div>
            <div className="col-span-2 text-right">Score</div>
          </div>

          {[1, 2, 3, 4, 5].map((rank) => (
            <div
              key={rank}
              className="grid grid-cols-12 px-8 py-6 items-center border-b border-white/5 hover:bg-white/5 transition"
            >
              <div className="col-span-1 text-lg font-semibold">{rank}</div>

              <div className="col-span-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10"></div>
                <div>
                  <div className="font-medium">Singer Name</div>
                  <div className="text-xs text-zinc-400">@username</div>
                </div>
              </div>

              <div className="col-span-4 hidden md:block text-zinc-400 text-sm">
                Acoustic Cover
              </div>

              <div className="col-span-2 text-right font-semibold">
                {1000 - rank * 73}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-sm text-zinc-500 max-w-3xl">
          Leaderboard scores are calculated using listener engagement,
          consistency, and community feedback. Artificial boosting or
          manipulation may result in penalties.
        </div>
      </div>
      <SongPlayer />
    </div>
  );
}

export default LeaderBoard;
