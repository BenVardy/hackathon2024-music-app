import {Alert, PermissionsAndroid, Platform, ToastAndroid} from 'react-native';

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
