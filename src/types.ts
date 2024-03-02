import {LatLng} from 'react-native-maps';

export interface SongMarker {
  marker: LatLng;
}

export interface Playlist {
  name: string;
  icon: string;
  songs: SongMarker[];
}

export type PlaylistSet = {[key: string]: Playlist};

export const DEFAULT_PLAYLISTS: PlaylistSet = {
  games: {
    name: 'Games',
    icon: '',
    songs: [],
  },
};

export const ASYNC_KEYS = {
  PLAYLISTS: 'playlists',
};
