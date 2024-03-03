import {LatLng} from 'react-native-maps';

export interface MarkerT {
  coordinate: LatLng;
  key: string;
}

export const ASYNC_KEYS = {
  MARKERS: 'MARKERS',
  SPOTIFY_TOKEN: 'ACCESSTOKEN',
};
