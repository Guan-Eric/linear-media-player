import { useEffect, useState } from "react";
import { Playlist, Track } from "../types";
import {
  FaRandom,
  FaRedo,
  FaStepForward,
  FaStepBackward,
  FaPauseCircle,
  FaPlayCircle,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import deepHouseCover from "../assets/deep_house_album_cover.jpg";
import neitherCover from "../assets/neither_and_both_album_cover.jpg";

interface NowPlayingProps {
  currentTrack: Track;
  currentPlaylist: Playlist;
  progress: number;
  setProgress: (value: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  currentIndex: number;
  setCurrentTrackIndex: (index: number) => void;
}

export default function NowPlaying({
  currentTrack,
  currentPlaylist,
  progress,
  setProgress,
  isPlaying,
  setIsPlaying,
  audioRef,
  currentIndex,
  setCurrentTrackIndex,
}: NowPlayingProps) {
  const audio = audioRef.current;
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [trackHistory, setTrackHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    const updateProgress = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(isNaN(percent) ? 0 : percent);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [currentTrack, isPlaying, volume, isMuted, audio]);

  useEffect(() => {
    if (progress >= 100) handleNextTrack();
  }, [progress]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleShuffle = () => setIsShuffled((prev) => !prev);
  const toggleLoop = () => setIsLooping((prev) => !prev);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audio) {
      const newProgress = parseFloat(e.target.value);
      audio.currentTime = (newProgress / 100) * audio.duration;
      setProgress(newProgress);
    }
  };

  const handleNextTrack = () => {
    setTrackHistory((prevHistory) => [...prevHistory, currentIndex]);
    if (isLooping) {
      setProgress(0);
      setIsPlaying(true);
      audio?.play();
    } else if (isShuffled) {
      let randomIndex = currentIndex;
      while (randomIndex == currentIndex) {
        randomIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
      }
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((currentIndex + 1) % currentPlaylist.tracks.length);
    }
  };

  const handlePrevTrack = () => {
    if (isShuffled && trackHistory.length > 0) {
      const lastIndex = trackHistory[trackHistory.length - 1];
      setTrackHistory((prev) => prev.slice(0, -1)); // remove last
      setCurrentTrackIndex(lastIndex);
    } else {
      setCurrentTrackIndex(
        currentIndex === 0
          ? currentPlaylist.tracks.length - 1
          : currentIndex - 1
      );
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex justify-center my-2">
        <img
          className="w-[80%] rounded-lg object-cover"
          src={
            currentPlaylist.name === "Deep House"
              ? deepHouseCover
              : neitherCover
          }
          alt={currentTrack.name}
        />
      </div>
      <div className="grid grid-cols-3 items-center mt-4">
        <div>
          <h3 className="text-lg font-semibold">{currentTrack.name}</h3>
          <p className="text-sm text-gray-400">{currentPlaylist.artist}</p>
        </div>
        <div className="flex justify-center items-center gap-4 ">
          <button className="cursor-pointer" onClick={toggleShuffle}>
            {isShuffled ? <FaRandom color="#3b82f6" /> : <FaRandom />}
          </button>

          <button className="cursor-pointer" onClick={handlePrevTrack}>
            <FaStepBackward />
          </button>

          <button onClick={handlePlayPause} className="text-4xl cursor-pointer">
            {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
          </button>

          <button className="cursor-pointer" onClick={handleNextTrack}>
            <FaStepForward />
          </button>

          <button className="cursor-pointer" onClick={toggleLoop}>
            {isLooping ? <FaRedo color="#3b82f6" /> : <FaRedo />}
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button className="cursor-pointer" onClick={toggleMute}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            className="cursor-pointer"
            type="range"
            value={volume}
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            value={progress}
            min={0}
            max={100}
            step={0.1}
            onChange={handleSeek}
            className="w-full h-2 appearance-none cursor-pointer bg-transparent mx-2 rounded"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${progress}%, #4b5563 ${progress}%)`,
            }}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
