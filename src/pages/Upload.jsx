// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import NavBar from "../functionalities/NavBar.jsx";
// import { apiFetch } from "../lib/api";
// import { getUser, isLoggedIn } from "../lib/auth";

// function Upload() {
//   const navigate = useNavigate();
//   const user = getUser();
//   const canUpload = isLoggedIn() && user?.role === "artist";
//   const [accept, setAccept] = useState(false);
//   const [imageFile, setImageFile] = useState(null);

//   const [audioFile, setAudioFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [genre, setGenre] = useState("");
//   const [description, setDescription] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const [quota, setQuota] = useState(null);
//   const [quotaLoading, setQuotaLoading] = useState(false);

//   const quotaRemaining = quota ? Number(quota.remaining) : null;
//   const quotaExhausted = quotaRemaining !== null && quotaRemaining <= 0;

//   const inputsDisabled = !canUpload || quotaExhausted || isSubmitting;

//   const fetchQuota = async () => {
//     if (!canUpload) {
//       setQuota(null);
//       return null;
//     }

//     try {
//       setQuotaLoading(true);
//       const data = await apiFetch("/api/music/upload-quota");
//       setQuota(data);
//       return data;
//     } catch {
//       // If quota endpoint fails, don't block upload (backend still hard-rejects on limit)
//       setQuota(null);
//       return null;
//     } finally {
//       setQuotaLoading(false);
//     }
//   };

//   useEffect(() => {
//     void fetchQuota();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [canUpload]);

//   useEffect(() => {
//     if (!canUpload) return;

//     const onFocus = () => void fetchQuota();
//     const onVisibility = () => {
//       if (document.visibilityState === "visible") void fetchQuota();
//     };

//     window.addEventListener("focus", onFocus);
//     document.addEventListener("visibilitychange", onVisibility);

//     // Periodic refresh so the UI re-enables when credits refill
//     const interval = window.setInterval(() => {
//       void fetchQuota();
//     }, 30_000);

//     return () => {
//       window.removeEventListener("focus", onFocus);
//       document.removeEventListener("visibilitychange", onVisibility);
//       window.clearInterval(interval);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [canUpload]);

//   const handleSubmit = async () => {
//     setError("");
//     if (!canUpload) {
//       setError("Please sign in with an artist account to upload.");
//       return;
//     }
//     if (!accept) {
//       setError("You must accept the content policy");
//       return;
//     }
//     if (!audioFile || !title || !description) {
//       setError("Audio, title, and description are required");
//       return;
//     }

//     // Preflight quota check BEFORE sending large FormData
//     const latestQuota = await fetchQuota();
//     if (latestQuota && Number(latestQuota.remaining) <= 0) {
//       setError(`Daily upload limit reached. You can upload again tomorrow (UTC).`);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("audio", audioFile);
//     if (imageFile) formData.append("image", imageFile);
//     formData.append("title", title);
//     formData.append("genre", genre);
//     formData.append("description", description);
//     formData.append("isPolicyAccepted", "true");

//     try {
//       setIsSubmitting(true);
//       const data = await apiFetch("/upload", {
//         method: "POST",
//         body: formData,
//       });

//       console.log("Upload success:", data);
//       // Refresh quota after successful upload
//       await fetchQuota();
//       navigate("/explore");
//     } catch (error) {
//       console.error("Error:", error);
//       if (error?.status === 429) {
//         const retryAfter = error?.retryAfter;
//         setError(
//           retryAfter
//             ? `${error?.message || "Too many requests"} Try again in ${retryAfter}s.`
//             : error?.message || "Too many requests"
//         );
//       } else {
//         setError(error?.message || "Upload failed");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
//       <NavBar />
//       <div className="mx-auto max-w-5xl">
//         <div className="mb-12">
//           <div className="text-4xl font-bold font-['Tektur',sans-serif]">
//             Upload Your Performance
//           </div>
//           <div className="mt-3 text-zinc-400 max-w-2xl">
//             Share your raw voice. No editing pressure. Simple, calm, and
//             beginner-friendly.
//           </div>
//         </div>

//         <div className="grid gap-10 md:grid-cols-2">
//           <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-10">

//             {error && (
//               <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
//                 {error}
//               </div>
//             )}

//             {!canUpload && (
//               <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-zinc-300">
//                 You’re not signed in as an artist. <Link className="underline" to="/signin">Sign in</Link> to upload.
//               </div>
//             )}

//             {canUpload && (
//               <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-zinc-300">
//                 {quotaLoading ? (
//                   <div>Checking upload quota…</div>
//                 ) : quota ? (
//                   <div>
//                     Uploads left today: <span className="text-white font-medium">{quota.remaining}</span> / {quota.max}
//                   </div>
//                 ) : (
//                   <div>Upload quota: unavailable (will be enforced by server)</div>
//                 )}
//               </div>
//             )}

//             {canUpload && quotaExhausted && (
//               <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-6 py-4 text-sm text-amber-200">
//                 Daily limit reached. Upload inputs are disabled until credits refill.
//               </div>
//             )}

//             {/* Audio Upload */}
//             <label className={`rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center transition block ${
//               inputsDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/30 cursor-pointer"
//             }`}>
//               <div className="text-lg font-medium">
//                 Drop your audio file here
//               </div>
//               <div className="mt-2 text-sm text-zinc-400">
//                 or click to browse
//                 <div className="mt-2 text-sm text-zinc-400">
//                   (MP3 only • up to 3 minutes • max 6 MB)
//                 </div>
//               </div>
//               <input
//                 type="file"
//                 accept="audio/mpeg"
//                 className="hidden"
//                 disabled={inputsDisabled}
//                 onChange={(e) => setAudioFile(e.target.files[0])}
//               />

//             </label>

//             {/* Image Upload */}
//             <label className={`mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center transition block ${
//               inputsDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/30 cursor-pointer"
//             }`}>
//               <div className="text-lg font-medium">
//                 Drop your cover image here
//               </div>
//               <div className="mt-2 text-sm text-zinc-400">
//                 or click to browse
//                 <div className="mt-2 text-sm text-zinc-400">
//                   (JPG / PNG • max 5 MB)
//                 </div>
//               </div>

//               <input
//                 type="file"
//                 accept="image/png, image/jpeg"
//                 className="hidden"
//                 disabled={inputsDisabled}
//                 onChange={(e) => setImageFile(e.target.files[0])}
//               />
//             </label>

//             {imageFile && (
//               <div className="mt-3 text-sm text-zinc-400">
//                 Selected image: {imageFile.name}
//               </div>
//             )}

//             {audioFile && (
//               <div className="mt-3 text-sm text-zinc-400">
//                 Selected audio: {audioFile.name}
//               </div>
//             )}

//             <div className="mt-8 space-y-6">
//               <div>
//                 <div className="text-sm mb-2 text-zinc-300">Title</div>
//                 <input
//                   type="text"
//                   placeholder="Song title"
//                   className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
//                   value={title}
//                   disabled={inputsDisabled}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <div className="text-sm mb-2 text-zinc-300">
//                   Genre (optional)
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Acoustic, Classical, Indie..."
//                   className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
//                   value={genre}
//                   disabled={inputsDisabled}
//                   onChange={(e) => setGenre(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <div className="text-sm mb-2 text-zinc-300">Description</div>
//                 <textarea
//                   rows={4}
//                   placeholder="Tell listeners something about this performance"
//                   className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm resize-none"
//                   value={description}
//                   disabled={inputsDisabled}
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-10 flex flex-col justify-between">
//             <div>
//               <div className="text-xl font-semibold mb-4">
//                 Before you publish
//               </div>
//               <ul className="space-y-3 text-sm text-zinc-400">
//                 <li>• Make sure your voice is clearly audible</li>
//                 <li>• Avoid heavy background noise</li>
//                 <li>• No perfection required — honesty matters more</li>
//               </ul>
//             </div>

//             <div className="mt-2 space-y-4">
//               <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-zinc-300">
//                 <div className="font-medium text-white mb-2">
//                   Content Policy Warning
//                 </div>
//                 <div className="text-zinc-400 leading-relaxed">
//                   Uploads containing vulgar language, sexual content, virtual
//                   sexual offenses, or music promoting extreme or explicit
//                   sexuality are strictly prohibited. Any violation will result
//                   in immediate account suspension or permanent ban.
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <input
//                   type="checkbox"
//                   className="mt-1 accent-white cursor-pointer"
//                   disabled={inputsDisabled}
//                   onChange={() => setAccept((prev) => !prev)}
//                 />
//                 <div className="text-sm text-zinc-400 leading-relaxed">
//                   I confirm that this upload follows the platform’s content
//                   guidelines and I understand that violations may lead to
//                   immediate banning without notice.
//                 </div>
//               </div>
//             </div>

//             <div className="mt-10">
//               <button
//                 disabled={!canUpload || !accept || isSubmitting || quotaExhausted}
//                 onClick={handleSubmit}
//                 className={`w-full text-center rounded-xl py-3 font-medium transition ${
//                   canUpload && accept && !isSubmitting && !quotaExhausted
//                     ? "bg-white text-black hover:bg-zinc-200 cursor-pointer"
//                     : "bg-white/10 text-zinc-500 cursor-not-allowed"
//                 }`}
//               >
//                 {isSubmitting ? "Publishing..." : "Publish Performance"}
//               </button>

//               <div className="mt-3 text-center text-xs text-zinc-500">
//                 By publishing, you agree to community guidelines
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Upload;


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../functionalities/NavBar.jsx";
import { apiFetch } from "../lib/api";
import { getUser, isLoggedIn } from "../lib/auth";
import { uploadToS3 } from "../lib/upload";

function Upload() {
  const navigate = useNavigate();
  const user = getUser();
  const canUpload = isLoggedIn() && user?.role === "artist";
  const [accept, setAccept] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [audioFile, setAudioFile] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [quota, setQuota] = useState(null);
  const [quotaLoading, setQuotaLoading] = useState(false);

  const quotaRemaining = quota ? Number(quota.remaining) : null;
  const quotaExhausted = quotaRemaining !== null && quotaRemaining <= 0;

  const inputsDisabled = !canUpload || quotaExhausted || isSubmitting;

  const fetchQuota = async () => {
    if (!canUpload) {
      setQuota(null);
      return null;
    }

    try {
      setQuotaLoading(true);
      const data = await apiFetch("/api/music/upload-quota");
      setQuota(data);
      return data;
    } catch {
      // If quota endpoint fails, don't block upload (backend still hard-rejects on limit)
      setQuota(null);
      return null;
    } finally {
      setQuotaLoading(false);
    }
  };

  useEffect(() => {
    void fetchQuota();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUpload]);

  useEffect(() => {
    if (!canUpload) return;

    const onFocus = () => void fetchQuota();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void fetchQuota();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    // Periodic refresh so the UI re-enables when credits refill
    const interval = window.setInterval(() => {
      void fetchQuota();
    }, 30_000);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUpload]);

  const handleSubmit = async () => {
    setError("");
    if (!canUpload) {
      setError("Please sign in with an artist account to upload.");
      return;
    }
    if (!accept) {
      setError("You must accept the content policy");
      return;
    }
    if (!audioFile || !title || !description) {
      setError("Audio, title, and description are required");
      return;
    }

    // Preflight quota check BEFORE uploading any files
    const latestQuota = await fetchQuota();
    if (latestQuota && Number(latestQuota.remaining) <= 0) {
      setError(`Daily upload limit reached. You can upload again tomorrow (UTC).`);
      return;
    }

    try {
      setIsSubmitting(true);

      // 1) audio and optional cover go straight to S3, 2) then the server saves the song.
      const audioKey = await uploadToS3(audioFile, "audio");
      const imageKey = imageFile ? await uploadToS3(imageFile, "image") : undefined;

      const data = await apiFetch("/upload/music/complete", {
        method: "POST",
        body: { audioKey, imageKey, title, genre, description, isPolicyAccepted: true },
      });

      console.log("Upload success:", data);
      // Refresh quota after successful upload
      await fetchQuota();
      navigate("/explore");
    } catch (error) {
      console.error("Error:", error);
      if (error?.status === 429) {
        const retryAfter = error?.retryAfter;
        setError(
          retryAfter
            ? `${error?.message || "Too many requests"} Try again in ${retryAfter}s.`
            : error?.message || "Too many requests"
        );
      } else {
        setError(error?.message || "Upload failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-24 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <div className="text-4xl font-bold font-['Tektur',sans-serif]">
            Upload Your Performance
          </div>
          <div className="mt-3 text-zinc-400 max-w-2xl">
            Share your raw voice. No editing pressure. Simple, calm, and
            beginner-friendly.
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-10">

            {error && (
              <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {!canUpload && (
              <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-zinc-300">
                You’re not signed in as an artist. <Link className="underline" to="/signin">Sign in</Link> to upload.
              </div>
            )}

            {canUpload && (
              <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-zinc-300">
                {quotaLoading ? (
                  <div>Checking upload quota…</div>
                ) : quota ? (
                  <div>
                    Uploads left today: <span className="text-white font-medium">{quota.remaining}</span> / {quota.max}
                  </div>
                ) : (
                  <div>Upload quota: unavailable (will be enforced by server)</div>
                )}
              </div>
            )}

            {canUpload && quotaExhausted && (
              <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-6 py-4 text-sm text-amber-200">
                Daily limit reached. Upload inputs are disabled until credits refill.
              </div>
            )}

            {/* Audio Upload */}
            <label className={`rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center transition block ${
              inputsDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/30 cursor-pointer"
            }`}>
              <div className="text-lg font-medium">
                Drop your audio file here
              </div>
              <div className="mt-2 text-sm text-zinc-400">
                or click to browse
                <div className="mt-2 text-sm text-zinc-400">
                  (MP3 only • up to 3 minutes • max 6 MB)
                </div>
              </div>
              <input
                type="file"
                accept="audio/mpeg"
                className="hidden"
                disabled={inputsDisabled}
                onChange={(e) => setAudioFile(e.target.files[0])}
              />

            </label>

            {/* Image Upload */}
            <label className={`mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center transition block ${
              inputsDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/30 cursor-pointer"
            }`}>
              <div className="text-lg font-medium">
                Drop your cover image here
              </div>
              <div className="mt-2 text-sm text-zinc-400">
                or click to browse
                <div className="mt-2 text-sm text-zinc-400">
                  (JPG / PNG • max 5 MB)
                </div>
              </div>

              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                disabled={inputsDisabled}
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </label>

            {imageFile && (
              <div className="mt-3 text-sm text-zinc-400">
                Selected image: {imageFile.name}
              </div>
            )}

            {audioFile && (
              <div className="mt-3 text-sm text-zinc-400">
                Selected audio: {audioFile.name}
              </div>
            )}

            <div className="mt-8 space-y-6">
              <div>
                <div className="text-sm mb-2 text-zinc-300">Title</div>
                <input
                  type="text"
                  placeholder="Song title"
                  className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
                  value={title}
                  disabled={inputsDisabled}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <div className="text-sm mb-2 text-zinc-300">
                  Genre (optional)
                </div>
                <input
                  type="text"
                  placeholder="Acoustic, Classical, Indie..."
                  className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm"
                  value={genre}
                  disabled={inputsDisabled}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>

              <div>
                <div className="text-sm mb-2 text-zinc-300">Description</div>
                <textarea
                  rows={4}
                  placeholder="Tell listeners something about this performance"
                  className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 outline-none focus:border-white/30 text-sm resize-none"
                  value={description}
                  disabled={inputsDisabled}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-10 flex flex-col justify-between">
            <div>
              <div className="text-xl font-semibold mb-4">
                Before you publish
              </div>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li>• Make sure your voice is clearly audible</li>
                <li>• Avoid heavy background noise</li>
                <li>• No perfection required — honesty matters more</li>
              </ul>
            </div>

            <div className="mt-2 space-y-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-zinc-300">
                <div className="font-medium text-white mb-2">
                  Content Policy Warning
                </div>
                <div className="text-zinc-400 leading-relaxed">
                  Uploads containing vulgar language, sexual content, virtual
                  sexual offenses, or music promoting extreme or explicit
                  sexuality are strictly prohibited. Any violation will result
                  in immediate account suspension or permanent ban.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 accent-white cursor-pointer"
                  disabled={inputsDisabled}
                  onChange={() => setAccept((prev) => !prev)}
                />
                <div className="text-sm text-zinc-400 leading-relaxed">
                  I confirm that this upload follows the platform’s content
                  guidelines and I understand that violations may lead to
                  immediate banning without notice.
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                disabled={!canUpload || !accept || isSubmitting || quotaExhausted}
                onClick={handleSubmit}
                className={`w-full text-center rounded-xl py-3 font-medium transition ${
                  canUpload && accept && !isSubmitting && !quotaExhausted
                    ? "bg-white text-black hover:bg-zinc-200 cursor-pointer"
                    : "bg-white/10 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Publishing..." : "Publish Performance"}
              </button>

              <div className="mt-3 text-center text-xs text-zinc-500">
                By publishing, you agree to community guidelines
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
