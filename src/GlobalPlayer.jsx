import SongPlayer from "./functionalities/SongPlayer";
import { usePlayer } from "./ContextAPI/PlayerContext";

export default function GlobalPlayer() {
  const { currentSong, playSignal, playAutoNext } = usePlayer();
  if (!currentSong) return null;

  return (
    <SongPlayer
      title={currentSong?.title || "Untitled"}
      singer={currentSong?.uploadedBy?.details?.username || "Unknown artist"}
      cover={currentSong?.musicImage}
      audioUrl={currentSong?.musicAudio}
      playSignal={playSignal}
      onEnded={playAutoNext}
      onNext={playAutoNext}
    />
  );
}
