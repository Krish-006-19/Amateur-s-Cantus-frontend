import "./App.css";
import { Link } from "react-router-dom";
import NavBar from "./functionalities/NavBar";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 font-['Tektur',sans-serif]">
      <NavBar />

      <div className="pt-40 pb-32 px-6 flex justify-center">
        <div className="max-w-4xl text-center">
          <div className="text-5xl md:text-6xl font-bold leading-tight font-['Tektur',sans-serif]">
            Where Amateur Voices
            <br />
            Become Music
          </div>
          <div className="mt-6 text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
            A calm, judgment‑free space for amateur singers to share raw
            performances and discover real voices.
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <div className="px-8 py-3 rounded-2xl bg-white text-black font-medium hover:bg-zinc-200 transition cursor-pointer">
              <Link to="/explore">
              Explore Songs
              </Link>
            </div>
            <div className="px-8 py-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition cursor-pointer">
              <Link to="/upload">
              Upload Your Voice
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-24">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl p-8 bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="text-xl font-semibold">Pure Performances</div>
            <div className="mt-3 text-zinc-400 text-sm leading-relaxed">
              No artificial promotion. Every song is heard for what it truly is.
            </div>
          </div>

          <div className="rounded-3xl p-8 bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="text-xl font-semibold">Beginner Friendly</div>
            <div className="mt-3 text-zinc-400 text-sm leading-relaxed">
              Simple flow designed for first‑time singers and casual creators.
            </div>
          </div>

          <div className="rounded-3xl p-8 bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="text-xl font-semibold">Community First</div>
            <div className="mt-3 text-zinc-400 text-sm leading-relaxed">
              A supportive environment without pressure, rankings, or
              comparison.
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-32">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] p-12 text-center bg-white/5 backdrop-blur-2xl border border-white/10">
          <div className="text-3xl font-bold font-['Tektur',sans-serif]">
            Your voice deserves space
          </div>
          <div className="mt-4 text-zinc-400">
            No studio. No perfection. Just honest sound.
          </div>
          <div className="mt-8 inline-block px-10 py-3 rounded-2xl bg-white text-black font-medium hover:bg-zinc-200 transition cursor-pointer">
            <Link to="/upload">
            Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-10 text-center text-zinc-500 text-sm">
        © 2026 Amateur’s Cantus. Built for amateur musicians.
      </div>
    </div>
  );
}

export default App;