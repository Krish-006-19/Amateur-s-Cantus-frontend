import React from "react";
import SongPlayer from "../functionalities/SongPlayer";
import NavBar from "../functionalities/NavBar";

function SongPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-40 font-['Tektur',sans-serif]">
      <NavBar/>
      <div className="mx-auto max-w-6xl">

        {/* SONG INFO CARD */}
        <div className="mb-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 flex flex-col md:flex-row gap-8">

          {/* COVER */}
          <div className="h-56 w-56 rounded-2xl bg-white/10 flex-shrink-0"></div>

          {/* METADATA */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold font-['Tektur',sans-serif] mb-3">
              Song Title
            </h1>

            <p className="text-zinc-400 mb-4">by Singer Name</p>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
              <span>Genre: Acoustic</span>
              <span>Duration: 3:12</span>
              <span>Language: Hindi</span>
              <span>Uploaded by Amateur</span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-zinc-300 leading-relaxed max-w-2xl">
              This is an honest amateur performance recorded in a single take.
              No autotune, no heavy processing — just raw voice and emotion.
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-4">
              <div className="px-6 py-2 rounded-2xl bg-white/10 border border-white/10 cursor-pointer hover:bg-white/20 transition">
                Add to Playlist
              </div>
              <div className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                View Artist
              </div>
            </div>
          </div>

        </div>

        {/* RELATED / FAMOUS SONGS */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 font-['Tektur',sans-serif]">
            Most Famous Songs
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:bg-white/10 transition cursor-pointer"
              >
                <div className="h-32 rounded-xl bg-white/10 mb-3"></div>
                <div className="font-medium mb-1">Song Name</div>
                <div className="text-xs text-zinc-400">Singer Name</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* GLOBAL PLAYER */}
      <SongPlayer />
    </div>
  );
}

export default SongPage;