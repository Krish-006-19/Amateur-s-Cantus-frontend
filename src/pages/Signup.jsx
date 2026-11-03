// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { apiFetch } from "../lib/api";
// import { setAuth } from "../lib/auth";

// function Signup() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [profileImage, setProfileImage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const handleSignup = async () => {
//     setError("");
//     if (!username || !email || !password) {
//       setError("Name, email, and password are required");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const formData = new FormData();
//       formData.append("username", username);
//       formData.append("email", email);
//       formData.append("password", password);
//       formData.append("role", "artist");
//       if (profileImage) formData.append("profileImage", profileImage);

//       const data = await apiFetch("/api/auth/register", {
//         method: "POST",
//         body: formData,
//       });

//       setAuth({ token: data.token, user: data.user });

//       navigate("/explore");
//     } catch (e) {
//       setError(e?.message || "Signup failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 font-['Tektur',sans-serif]">
//       <div className="w-full max-w-md rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-10">
//         <div className="text-center">
//           <div className="text-2xl font-semibold font-['Tektur',sans-serif] tracking-wide">
//             Join Amateur’s Cantus
//           </div>
//           <div className="mt-2 text-sm text-zinc-400">Create your account</div>
//         </div>

//         <div className="mt-10 space-y-6">
//           {error && (
//             <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
//               {error}
//             </div>
//           )}

//           <div>
//             <div className="text-sm mb-2 text-zinc-300">Profile image (optional)</div>
//             <label className="rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center hover:border-white/30 transition cursor-pointer block">
//               <input
//                 type="file"
//                 accept="image/png, image/jpeg"
//                 className="hidden"
//                 onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
//               />
//               <span className="text-sm text-zinc-400">
//                 {profileImage ? profileImage.name : "Choose image (JPG/PNG, max 2MB)"}
//               </span>
//             </label>
//           </div>

//           <div>
//             <div className="text-sm mb-2 text-zinc-300">Name</div>
//             <input
//               type="text"
//               placeholder="Your name"
//               className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>

//           <div>
//             <div className="text-sm mb-2 text-zinc-300">Email</div>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <div className="text-sm mb-2 text-zinc-300">Password</div>
//             <input
//               type="password"
//               placeholder="Create a password"
//               className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <div className="mt-6">
//             <button
//               type="button"
//               disabled={isSubmitting}
//               onClick={handleSignup}
//               className="w-full text-center rounded-xl bg-white text-black py-3 font-medium hover:bg-zinc-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? "Creating..." : "Create Account"}
//             </button>
//           </div>

//           <div className="text-center text-sm text-zinc-400 mt-6">
//             Already have an account?{" "}
//             <span className="text-white cursor-pointer hover:underline">
//               <Link to="/signin">Sign in</Link>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { setAuth } from "../lib/auth";
import { uploadProfileImage } from "../lib/upload";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (!username || !email || !password) {
      setError("Name, email, and password are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { username, email, password, role: "artist" },
      });

      setAuth({ token: data.token, user: data.user });

      // The profile picture goes straight to S3 after the account exists.
      // A failure here must not undo a successful signup, so it is non-fatal.
      if (profileImage) {
        try {
          const updatedUser = await uploadProfileImage(profileImage);
          setAuth({ token: data.token, user: updatedUser });
        } catch (imgErr) {
          console.warn("Profile image upload failed:", imgErr);
        }
      }

      navigate("/explore");
    } catch (e) {
      setError(e?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 font-['Tektur',sans-serif]">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-10">
        <div className="text-center">
          <div className="text-2xl font-semibold font-['Tektur',sans-serif] tracking-wide">
            Join Amateur’s Cantus
          </div>
          <div className="mt-2 text-sm text-zinc-400">Create your account</div>
        </div>

        <div className="mt-10 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <div className="text-sm mb-2 text-zinc-300">Profile image (optional)</div>
            <label className="rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center hover:border-white/30 transition cursor-pointer block">
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
              />
              <span className="text-sm text-zinc-400">
                {profileImage ? profileImage.name : "Choose image (JPG/PNG, max 2MB)"}
              </span>
            </label>
          </div>

          <div>
            <div className="text-sm mb-2 text-zinc-300">Name</div>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <div className="text-sm mb-2 text-zinc-300">Email</div>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="text-sm mb-2 text-zinc-300">Password</div>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSignup}
              className="w-full text-center rounded-xl bg-white text-black py-3 font-medium hover:bg-zinc-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </div>

          <div className="text-center text-sm text-zinc-400 mt-6">
            Already have an account?{" "}
            <span className="text-white cursor-pointer hover:underline">
              <Link to="/signin">Sign in</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
