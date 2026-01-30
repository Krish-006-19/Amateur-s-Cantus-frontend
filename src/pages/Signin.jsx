import React from "react";
import { Link } from "react-router-dom";

function Signin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 font-['Tektur',sans-serif]">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-10">
        <div className="text-center">
          <div className="text-2xl font-semibold font-['Tektur',sans-serif] tracking-wide">
            Amateur’s Cantus
          </div>
          <div className="mt-2 text-sm text-zinc-400">Sign in to continue</div>
        </div>

        <div className="mt-10 space-y-6">
          <div>
            <div className="text-sm mb-2 text-zinc-300">Email</div>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
            />
          </div>

          <div>
            <div className="text-sm mb-2 text-zinc-300">Password</div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-400">
            <div className="cursor-pointer hover:text-zinc-200">
              Forgot password?
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full text-center rounded-xl bg-white text-black py-3 font-medium cursor-pointer hover:bg-zinc-200 transition">
              Sign In
            </div>
          </div>

          <div className="text-center text-sm text-zinc-400 mt-6">
            Don’t have an account?{" "}
            <span className="text-white cursor-pointer hover:underline">
              <Link to="/signup">Sign up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
