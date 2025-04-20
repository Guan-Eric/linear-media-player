// MediaPlayer.jsx
import { useState, useRef } from "react";
import PlayerHeader from "../src/components/PlayerHeader";
import NowPlaying from "../src/components/NowPlaying";
import CurrentPlaylist from "./components/CurrentPlaylist";
import playlistsData from "../src/data/playlists.json";
import { Playlist, Track } from "./types";

export default function MediaPlayer() {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const currentPlaylist = playlistsData.playlists[
    currentPlaylistIndex
  ] as Playlist;
  const currentTrack = currentPlaylist.tracks[currentTrackIndex] as Track;

  const changePlaylist = (index: number) => {
    setCurrentPlaylistIndex(index);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setProgress(0);
  };

  const selectTrack = (trackIndex: number) => {
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
    setProgress(0);
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white rounded-lg shadow-xl max-w-3xl mx-auto">
      <audio ref={audioRef} src={currentTrack.url} />
      <PlayerHeader
        playlists={playlistsData.playlists}
        currentPlaylistIndex={currentPlaylistIndex}
        changePlaylist={changePlaylist}
      />
      <NowPlaying
        currentTrack={currentTrack}
        currentPlaylist={currentPlaylist}
        progress={progress}
        setProgress={setProgress}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
        currentIndex={currentTrackIndex}
        setCurrentTrackIndex={setCurrentTrackIndex}
      />
      <CurrentPlaylist
        tracks={currentPlaylist.tracks}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        selectTrack={selectTrack}
      />
    </div>
  );
}
