import { Track } from "../types";

interface CurrentPlaylistProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  selectTrack: (trackIndex: number) => void;
}
export default function CurrentPlaylist({
  tracks,
  currentTrackIndex,
  selectTrack,
}: CurrentPlaylistProps) {
  return (
    <div className="p-4 space-y-2">
      <h4 className="text-md font-semibold mb-2">Tracklist</h4>
      {tracks.map((track, index) => (
        <div
          key={track.name}
          className={`p-2 rounded cursor-pointer ${
            index === currentTrackIndex ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
          onClick={() => selectTrack(index)}
        >
          <p className="font-medium">{track.name}</p>
        </div>
      ))}
    </div>
  );
}
