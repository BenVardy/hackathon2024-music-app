import {LatLng} from 'react-native-maps';

export interface Song {
  id: string;
  name: string;
  artist: string;
}

export interface SongMarker {
  marker: LatLng;
}

export interface Playlist {
  text: string;
  image: string;
  color: string;
  songs: SongMarker[];
}

export type PlaylistSet = {[key: string]: Playlist};

export const DEFAULT_PLAYLISTS: PlaylistSet = {
  eightBit: {
    text: '8bit',
    image: 'eightBit',
    color: '#ff8cb4',
    songs: [],
  },
  gamer: {
    text: 'Gamer',
    image: 'gamer',
    color: '#c7dcff',
    songs: [],
  },
  puzzle: {
    text: 'Puzzle',
    image: 'puzzle',
    color: '#fbffc7',
    songs: [],
  },
  headphones: {
    text: 'Headphones',
    image: 'headphones',
    color: '#edc7ff',
    songs: [],
  },
  idea: {
    text: 'Idea',
    image: 'idea',
    color: '#d6ffc7',
    songs: [],
  },
  coffee: {
    text: 'Coffee',
    image: 'coffee',
    color: '#ffd1c7',
    songs: [],
  },
  star: {
    text: 'Star',
    image: 'star',
    color: '#ffcb8c',
    songs: [],
  },

  bubble: {
    text: 'Bubble',
    image: 'bubble',
    color: '#8cafff',
    songs: [],
  },
};

export const ASYNC_KEYS = {
  PLAYLISTS: 'playlists',
  SPOTIFY_TOKEN: 'ACCESSTOKEN',
};
