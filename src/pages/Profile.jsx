// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import NavBar from "../functionalities/NavBar";
// import { apiFetch } from "../lib/api";
// import { isLoggedIn, setAuth, clearAuth, getToken } from "../lib/auth";

// function Profile() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const [profileImagePreview, setProfileImagePreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [error, setError] = useState("");
//   const [toast, setToast] = useState("");
//   const [confirmDelete, setConfirmDelete] = useState("");

//   const flash = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(""), 2500);
//   };

//   useEffect(() => {
//     if (!isLoggedIn()) {
//       navigate("/signin");
//       return;
//     }
//     const load = async () => {
//       try {
//         setIsLoading(true);
//         setError("");
//         const data = await apiFetch("/api/auth/me");
//         setUser(data.user);
//         setUsername(data.user?.username ?? "");
//         setEmail(data.user?.email ?? "");
//         setProfileImagePreview(data.user?.profileImage ?? null);
//       } catch (e) {
//         setError(e?.message || "Failed to load profile");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     load();
//   }, [navigate]);

//   const handleSave = async () => {
//     setError("");
//     try {
//       setIsSaving(true);
//       const formData = new FormData();
//       formData.append("username", username);
//       formData.append("email", email);
//       if (password) formData.append("password", password);
//       if (profileImageFile) formData.append("profileImage", profileImageFile);

//       const data = await apiFetch("/api/auth/me", {
//         method: "PATCH",
//         body: formData,
//       });
//       setAuth({ token: getToken(), user: data.user });
//       setUser(data.user);
//       setProfileImagePreview(data.user?.profileImage ?? null);
//       setProfileImageFile(null);
//       setPassword("");
//       flash("Profile updated");
//     } catch (e) {
//       setError(e?.message || "Failed to update");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (confirmDelete !== "DELETE") return;
//     setError("");
//     try {
//       setIsDeleting(true);
//       await apiFetch("/api/auth/me", { method: "DELETE" });
//       clearAuth();
//       navigate("/signin");
//       window.location.reload();
//     } catch (e) {
//       setError(e?.message || "Failed to delete account");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const onProfileImageChange = (e) => {
//     const file = e.target.files?.[0];
//     setProfileImageFile(file || null);
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setProfileImagePreview(url);
//     } else {
//       setProfileImagePreview(user?.profileImage ?? null);
//     }
//   };

//   if (!isLoggedIn()) return null;
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
//         <NavBar />
//         <div className="mx-auto max-w-2xl rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
//           Loading profile...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
//       <NavBar />
//       <div className="mx-auto max-w-2xl">
//         <div className="mb-10">
//           <div className="text-4xl font-bold font-['Tektur',sans-serif]">Profile</div>
//           <div className="mt-3 text-zinc-400">Edit your account and profile image.</div>
//         </div>

//         {toast && (
//           <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-zinc-200">
//             {toast}
//           </div>
//         )}
//         {error && (
//           <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
//             {error}
//           </div>
//         )}

//         <div className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 space-y-6">
//           <div>
//             <div className="text-sm mb-2 text-zinc-300">Profile image</div>
//             <div className="flex items-center gap-6">
//               <div
//                 className="h-24 w-24 rounded-2xl bg-white/10 shrink-0"
//                 style={{
//                   backgroundImage: profileImagePreview ? `url(${profileImagePreview})` : undefined,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               />
//               <label className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-2 text-sm cursor-pointer hover:border-white/30 transition">
//                 <input
//                   type="file"
//                   accept="image/png, image/jpeg"
//                   className="hidden"
//                   onChange={onProfileImageChange}
//                 />
//                 Change photo
//               </label>
//             </div>
//           </div>

//           <div>
//             <div className="text-sm mb-2 text-zinc-300">Username</div>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
//             />
//           </div>
//           <div>
//             <div className="text-sm mb-2 text-zinc-300">Email</div>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
//             />
//           </div>
//           <div>
//             <div className="text-sm mb-2 text-zinc-300">New password (leave blank to keep)</div>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={isSaving}
//             className="w-full rounded-xl bg-white text-black py-3 font-medium hover:bg-zinc-200 transition disabled:opacity-60"
//           >
//             {isSaving ? "Saving..." : "Save changes"}
//           </button>
//         </div>

//         <div className="mt-12 rounded-4xl bg-red-500/5 border border-red-500/20 p-8">
//           <div className="text-lg font-semibold text-red-200 mb-2">Delete account</div>
//           <p className="text-sm text-zinc-400 mb-4">
//             This will permanently delete your account and all associated data. This cannot be undone.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 items-start">
//             <input
//               type="text"
//               value={confirmDelete}
//               onChange={(e) => setConfirmDelete(e.target.value)}
//               placeholder='Type DELETE to confirm'
//               className="rounded-xl bg-black/30 border border-white/10 px-4 py-2 text-sm w-full sm:w-48"
//             />
//             <button
//               type="button"
//               onClick={handleDeleteAccount}
//               disabled={confirmDelete !== "DELETE" || isDeleting}
//               className="px-6 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isDeleting ? "Deleting..." : "Delete account"}
//             </button>
//           </div>
//         </div>

//         <div className="mt-6 text-center text-sm text-zinc-500">
//           <Link to="/explore" className="hover:text-white transition">Back to Explore</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../functionalities/NavBar";
import { apiFetch } from "../lib/api";
import { isLoggedIn, setAuth, clearAuth, getToken } from "../lib/auth";
import { uploadProfileImage } from "../lib/upload";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/signin");
      return;
    }
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await apiFetch("/api/auth/me");
        setUser(data.user);
        setUsername(data.user?.username ?? "");
        setEmail(data.user?.email ?? "");
        setProfileImagePreview(data.user?.profileImage ?? null);
      } catch (e) {
        setError(e?.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleSave = async () => {
    setError("");
    try {
      setIsSaving(true);
      // Send only what changed, so changing just the photo doesn't count
      // as a credential change (the server limits those to once a week).
      const changes = {};
      if (username !== (user?.username ?? "")) changes.username = username;
      if (email !== (user?.email ?? "")) changes.email = email;
      if (password) changes.password = password;

      let nextUser = user;
      if (Object.keys(changes).length > 0) {
        const data = await apiFetch("/api/auth/me", { method: "PATCH", body: changes });
        nextUser = data.user;
      }
      if (profileImageFile) {
        nextUser = await uploadProfileImage(profileImageFile);
      }
      setAuth({ token: getToken(), user: nextUser });
      setUser(nextUser);
      setProfileImagePreview(nextUser?.profileImage ?? null);
      setProfileImageFile(null);
      setPassword("");
      flash("Profile updated");
    } catch (e) {
      setError(e?.message || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== "DELETE") return;
    setError("");
    try {
      setIsDeleting(true);
      await apiFetch("/api/auth/me", { method: "DELETE" });
      clearAuth();
      navigate("/signin");
      window.location.reload();
    } catch (e) {
      setError(e?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const onProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    setProfileImageFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImagePreview(url);
    } else {
      setProfileImagePreview(user?.profileImage ?? null);
    }
  };

  if (!isLoggedIn()) return null;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
        <NavBar />
        <div className="mx-auto max-w-2xl rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <div className="text-4xl font-bold font-['Tektur',sans-serif]">Profile</div>
          <div className="mt-3 text-zinc-400">Edit your account and profile image.</div>
        </div>

        {toast && (
          <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-zinc-200">
            {toast}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="rounded-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 space-y-6">
          <div>
            <div className="text-sm mb-2 text-zinc-300">Profile image</div>
            <div className="flex items-center gap-6">
              <div
                className="h-24 w-24 rounded-2xl bg-white/10 shrink-0"
                style={{
                  backgroundImage: profileImagePreview ? `url(${profileImagePreview})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <label className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-2 text-sm cursor-pointer hover:border-white/30 transition">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={onProfileImageChange}
                />
                Change photo
              </label>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2 text-zinc-300">Username</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
            />
          </div>
          <div>
            <div className="text-sm mb-2 text-zinc-300">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
            />
          </div>
          <div>
            <div className="text-sm mb-2 text-zinc-300">New password (leave blank to keep)</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-xl bg-white text-black py-3 font-medium hover:bg-zinc-200 transition disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div className="mt-12 rounded-4xl bg-red-500/5 border border-red-500/20 p-8">
          <div className="text-lg font-semibold text-red-200 mb-2">Delete account</div>
          <p className="text-sm text-zinc-400 mb-4">
            This will permanently delete your account and all associated data. This cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <input
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder='Type DELETE to confirm'
              className="rounded-xl bg-black/30 border border-white/10 px-4 py-2 text-sm w-full sm:w-48"
            />
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={confirmDelete !== "DELETE" || isDeleting}
              className="px-6 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-zinc-500">
          <Link to="/explore" className="hover:text-white transition">Back to Explore</Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
