export interface Track {
  name: string;
  url: string;
  duration: number;
}

export interface Playlist {
  name: string;
  artist: string;
  year: number;
  tracks: Track[];
}
