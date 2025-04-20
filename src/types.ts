export interface Track {
  name: string;
  url: string;
  duration: number;
}

export interface Playlist {
  name: string;
  artist: number;
  year: number;
  tracks: Track[];
}
