import { Playlist } from "../types";

interface PlayerHeaderProps {
  playlists: Playlist[];
  currentPlaylistIndex: number;
  changePlaylist: (playlistIndex: number) => void;
}
export default function PlayerHeader({
  playlists,
  currentPlaylistIndex,
  changePlaylist,
}: PlayerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <h2 className="text-xl font-bold">Now Playing</h2>
      <select
        className="bg-gray-800 text-white p-2 rounded"
        value={currentPlaylistIndex}
        onChange={(e) => changePlaylist(Number(e.target.value))}
      >
        {playlists.map((playlist, index) => (
          <option key={playlist.name} value={index}>
            {playlist.name}
          </option>
        ))}
      </select>
    </div>
  );
}
