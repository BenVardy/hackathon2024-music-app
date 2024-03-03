import {Alert, PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {LatLng} from 'react-native-maps';
import {PlaylistSet, SongMarker} from '../types';

/**
 * Get permissions for location services.
 *
 * @returns The status from getting permissions.
 */
export async function getLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    Alert.alert('Not allowed iOS');
    return false;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location services denied', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('Location services rejected always', ToastAndroid.LONG);
  }

  return false;
}

export function closestSong(
  myCoords: LatLng,
  playlists: PlaylistSet,
): SongMarker | null {
  let smallestDistance = Number.MAX_VALUE;
  let closestSongRes: SongMarker | null = null;

  for (let playlist of Object.values(playlists)) {
    for (let song of playlist.songs) {
      const {marker} = song;

      const distance =
        Math.pow(marker.latitude - myCoords.latitude, 2) +
        Math.pow(marker.longitude - myCoords.longitude, 2);
      if (distance < 0.00004504504 && distance < smallestDistance) {
        smallestDistance = distance;
        closestSongRes = song;
      }
    }
  }

  return closestSongRes;
}
