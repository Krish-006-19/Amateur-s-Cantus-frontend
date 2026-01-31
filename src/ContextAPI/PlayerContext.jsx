import React, { createContext, useContext, useMemo, useState } from "react";

const PlayerContext = createContext(null);

/** Score for "most viewed & most liked" ordering: plays + 2*likes */
export function popularityScore(song) {
  return Number(song?.plays || 0) + Number(song?.likes || 0) * 2;
}

export function sortByPopular(songs) {
  const list = Array.isArray(songs) ? [...songs] : [];
  list.sort((a, b) => {
    const scoreA = popularityScore(a);
    const scoreB = popularityScore(b);
    return scoreB - scoreA;
  });
  return list;
}

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [playSignal, setPlaySignal] = useState(0);
  const [playMode, setPlayMode] = useState('smart');

  // mode:
  // - 'playlist' => next/auto-next stays sequential within the provided queue
  // - 'explore'   => auto-next jumps to the most popular song in the queue
  // - 'smart'     => auto-next uses the "more famous, else ascending" rule
  const playSong = (song, nextQueue, options) => {
    if (!song) return;
    if (nextQueue && Array.isArray(nextQueue) && nextQueue.length > 0) {
      setQueue(nextQueue);
    }
    if (options && options.mode) {
      setPlayMode(String(options.mode));
    }
    setCurrentSong(song);
    setPlaySignal((n) => n + 1);
  };

  const playNext = () => {
    if (!queue.length || !currentSong) return;
    const idx = queue.findIndex((s) => s && String(s._id) === String(currentSong._id));
    if (idx < 0 || idx >= queue.length - 1) return;
    const next = queue[idx + 1];
    setCurrentSong(next);
    setPlaySignal((n) => n + 1);
  };

  // Smart autoplay:
  // - If there exists a more popular song than the current, jump to the nearest-more-popular one.
  // - If current is already the most popular, move to the next song in ascending popularity order (wrap-around).
  const playSmartNext = () => {
    if (!queue.length || !currentSong) return;

    const list = queue.filter(Boolean);
    if (!list.length) return;

    const currentId = String(currentSong?._id || '');
    const currentInQueue = list.find((s) => String(s?._id) === currentId);
    const current = currentInQueue || currentSong;
    const currentScore = popularityScore(current);

    const higher = list.filter((s) => popularityScore(s) > currentScore);
    let next = null;

    if (higher.length > 0) {
      higher.sort((a, b) => {
        const d = popularityScore(a) - popularityScore(b);
        if (d !== 0) return d;
        return String(a?._id || '').localeCompare(String(b?._id || ''));
      });
      next = higher[0];
    } else {
      const asc = [...list].sort((a, b) => {
        const d = popularityScore(a) - popularityScore(b);
        if (d !== 0) return d;
        return String(a?._id || '').localeCompare(String(b?._id || ''));
      });

      const idx = asc.findIndex((s) => String(s?._id) === currentId);
      const nextIdx = idx >= 0 ? (idx + 1) % asc.length : 0;
      next = asc[nextIdx];
    }

    if (!next) return;
    setCurrentSong(next);
    setPlaySignal((n) => n + 1);
  };

  const playAutoNext = () => {
    if (!queue.length || !currentSong) return;

    if (playMode === 'playlist') {
      return playNext();
    }

    if (playMode === 'explore') {
      const list = queue.filter(Boolean);
      if (!list.length) return;
      const currentScore = popularityScore(currentSong);
      const maxSong = [...list].sort((a, b) => popularityScore(b) - popularityScore(a))[0];
      const maxScore = popularityScore(maxSong);
      if (maxSong && maxScore > currentScore) {
        setCurrentSong(maxSong);
        setPlaySignal((n) => n + 1);
        return;
      }
      // Already at most famous (or tied): fall back to the smart rule.
      return playSmartNext();
    }

    return playSmartNext();
  };

  const value = useMemo(
    () => ({
      currentSong,
      setCurrentSong,
      queue,
      setQueue,
      playSong,
      playNext,
      playSmartNext,
      playAutoNext,
      playSignal,
    }),
    [currentSong, queue, playSignal, playMode]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
