import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../functionalities/NavBar";
import { apiFetch } from "../lib/api";
import { getUser, isLoggedIn, setAuth, getToken } from "../lib/auth";
import { usePlayer } from "../ContextAPI/PlayerContext";

function SongPage() {
  const { id } = useParams();
  const [user, setUser] = useState(getUser());
  const consumerId = user?.profiles?.consumer ?? (user?.role === "consumer" ? user?.profile?.id : undefined);
  const canUseConsumerFeatures = isLoggedIn() && (user?.role === "consumer" || user?.role === "artist") && Boolean(consumerId);

  const [song, setSong] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const { playSong } = usePlayer();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportProof, setReportProof] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (
      isLoggedIn() &&
      currentUser &&
      (currentUser.role === "consumer" || currentUser.role === "artist") &&
      !currentUser.profiles
    ) {
      apiFetch("/api/auth/me")
        .then((data) => {
          const merged = { ...data.user, profile: data.profile, profiles: data.profiles };
          setAuth({ token: getToken(), user: merged });
          setUser(merged);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    setUser(getUser());
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [one, list] = await Promise.all([
          apiFetch(`/api/music/${id}`),
          apiFetch(`/api/music`).catch((e) => (e?.status === 404 ? [] : Promise.reject(e))),
        ]);

        if (!isMounted) return;
        setSong(one);
        setAllSongs(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load track");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const famous = useMemo(() => {
    const other = (Array.isArray(allSongs) ? allSongs : []).filter((s) => s?._id !== id);
    other.sort((a, b) => Number(b?.plays || 0) - Number(a?.plays || 0));
    return other.slice(0, 8);
  }, [allSongs, id]);

  const artistName = song?.uploadedBy?.details?.username || "Unknown artist";
  const cover = song?.musicImage;
  const ownerAuthId = song?.uploadedBy?.details?._id;
  const isOwner = Boolean(user?.id && ownerAuthId && String(user.id) === String(ownerAuthId));
  const alreadyLiked = Boolean(
    song?.likedBy?.length && consumerId && song.likedBy.some((lid) => String(lid) === String(consumerId))
  );
  const flaggedForEdit = Boolean(song?.flaggedForEdit);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const queueForNext = useMemo(() => {
    if (!song) return [];
    const others = (Array.isArray(allSongs) ? allSongs : []).filter((s) => s?._id !== song._id);
    others.sort((a, b) => {
      const scoreA = Number(a?.plays || 0) + Number(a?.likes || 0) * 2;
      const scoreB = Number(b?.plays || 0) + Number(b?.likes || 0) * 2;
      return scoreB - scoreA;
    });
    return [song, ...others];
  }, [song, allSongs]);

  const handlePlay = async () => {
    if (!song?._id) return;
    playSong(song, queueForNext);
    try {
      const updated = await apiFetch(`/api/music/${song._id}/play`, { method: "PATCH" });
      if (updated) setSong(updated);
    } catch {
      // non-blocking
    }
  };

  const handleLike = async () => {
    if (!song?._id || alreadyLiked) return;
    try {
      const updated = await apiFetch(`/api/music/${song._id}/like`, { method: "PATCH" });
      setSong(updated);
    } catch (e) {
      flash(e?.message || "Could not like");
    }
  };

  const openEdit = () => {
    setEditTitle(song?.title ?? "");
    setEditGenre(song?.genre ?? "");
    setEditDescription(song?.description ?? "");
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!song?._id) return;
    setIsSavingEdit(true);
    try {
      const updated = await apiFetch(`/api/music/${song._id}`, {
        method: "PATCH",
        body: { title: editTitle, genre: editGenre, description: editDescription },
      });
      setSong(updated);
      setIsEditOpen(false);
      flash("Details updated");
    } catch (e) {
      flash(e?.message || "Failed to update");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const addToPlaylist = async () => {
    if (!isLoggedIn()) {
      flash("Sign in to use playlist");
      return;
    }
    if (!canUseConsumerFeatures) {
      flash("Refresh the page to use playlist");
      return;
    }
    try {
      await apiFetch(`/api/consumer/playlist/${consumerId}/${id}`, { method: "POST" });
      flash("Added to playlist");
    } catch (e) {
      flash(e?.message || "Could not add to playlist");
    }
  };

  const submitReport = async () => {
    if (!canUseConsumerFeatures) {
      flash("Sign in to report songs");
      return;
    }
    const reason = reportReason.trim();
    const proof = reportProof.trim();
    if (!reason) {
      flash("Please enter a reason");
      return;
    }
    setIsReporting(true);
    try {
      await apiFetch(`/api/report/${consumerId}/${id}`, {
        method: "POST",
        body: { reason, proof },
      });
      flash("Report submitted");
      setReportReason("");
      setReportProof("");
      setIsReportOpen(false);
    } catch (e) {
      flash(e?.message || "Could not submit report");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 px-6 pt-32 pb-40 font-['Tektur',sans-serif]">
      <NavBar />
      <div className="mx-auto max-w-6xl">
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

        {isLoading ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">Loading track...</div>
        ) : !song ? (
          <div className="rounded-4xl bg-white/5 border border-white/10 p-8 text-zinc-300">Track not found.</div>
        ) : (
          <>
            {/* SONG INFO CARD */}
            <div className="mb-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 flex flex-col md:flex-row gap-8">
              {/* COVER */}
              <div
                className="h-56 w-56 rounded-2xl bg-white/10 shrink-0"
                style={{
                  backgroundImage: cover ? `url(${cover})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              {/* METADATA */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold font-['Tektur',sans-serif] mb-3">{song?.title || "Untitled"}</h1>
                <p className="text-zinc-400 mb-4">by {artistName}</p>

                <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
                  <span>Genre: {song?.genre || "Unknown"}</span>
                  <span>Listens: {Number(song?.plays || 0).toLocaleString()}</span>
                  <span>Likes: {Number(song?.likes || 0).toLocaleString()}</span>
                </div>

                <p className="text-zinc-300 leading-relaxed max-w-2xl">{song?.description || ""}</p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={handlePlay}
                    className="px-6 py-2 rounded-2xl bg-white text-black cursor-pointer hover:bg-zinc-200 transition"
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={handleLike}
                    disabled={isOwner || alreadyLiked}
                    className={`px-6 py-2 rounded-2xl bg-white/10 border border-white/10 transition ${
                      isOwner || alreadyLiked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/20"
                    }`}
                  >
                    {alreadyLiked ? "Liked" : "Like"}
                  </button>
                  <button
                    type="button"
                    onClick={addToPlaylist}
                    className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition"
                  >
                    Add to Playlist
                  </button>

                  {canUseConsumerFeatures ? (
                    <button
                      type="button"
                      onClick={() => setIsReportOpen((v) => !v)}
                      className="px-6 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 cursor-pointer hover:bg-red-500/15 transition"
                    >
                      {isReportOpen ? "Close Report" : "Report"}
                    </button>
                  ) : null}

                  <Link
                    to="/explore"
                    className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition"
                  >
                    Back to Explore
                  </Link>
                </div>

                {isOwner ? (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs text-zinc-500">
                      Your own likes and views aren’t counted on your songs.
                    </div>
                    {flaggedForEdit && (
                      <div className="text-sm text-amber-200">
                        This track was reported. Please update the details to comply with guidelines.
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={openEdit}
                      className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition text-sm"
                    >
                      Edit details
                    </button>
                  </div>
                ) : null}

                {isOwner && isEditOpen ? (
                  <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
                    <div className="text-sm font-medium text-zinc-200">Edit track details</div>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2 text-white placeholder:text-zinc-400 focus:outline-none text-sm"
                    />
                    <input
                      value={editGenre}
                      onChange={(e) => setEditGenre(e.target.value)}
                      placeholder="Genre"
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2 text-white placeholder:text-zinc-400 focus:outline-none text-sm"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      rows={3}
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2 text-white placeholder:text-zinc-400 focus:outline-none resize-none text-sm"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={isSavingEdit}
                        className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-50"
                      >
                        {isSavingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditOpen(false)}
                        className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm hover:bg-white/20 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {canUseConsumerFeatures && isReportOpen ? (
                  <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
                    <div className="text-white font-semibold mb-3">Report this song</div>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder="Reason (required)"
                        className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none"
                      />
                      <textarea
                        value={reportProof}
                        onChange={(e) => setReportProof(e.target.value)}
                        placeholder="Proof / context (optional)"
                        rows={3}
                        className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none resize-none"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={submitReport}
                          disabled={isReporting}
                          className="px-5 py-2 rounded-xl bg-red-500/15 border border-red-500/25 hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          {isReporting ? "Submitting..." : "Submit"}
                        </button>
                        <div className="text-xs text-zinc-400">Duplicate pending reports may be rejected.</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* RELATED / FAMOUS SONGS */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 font-['Tektur',sans-serif]">Most Famous Songs</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {famous.map((s) => (
                  <div
                    key={s?._id}
                    className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:bg-white/10 transition cursor-pointer"
                  >
                    <Link to={s?._id ? `/track/${s._id}` : "/explore"}>
                      <div
                        className="h-32 rounded-xl bg-white/10 mb-3"
                        style={{
                          backgroundImage: s?.musicImage ? `url(${s.musicImage})` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div className="font-medium mb-1 truncate">{s?.title || "Untitled"}</div>
                      <div className="text-xs text-zinc-400 truncate">
                        {s?.uploadedBy?.details?.username || "Unknown artist"}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

export default SongPage;