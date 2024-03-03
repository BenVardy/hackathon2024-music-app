import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import GeoLocation, {
  GeoCoordinates,
  GeoPosition,
} from 'react-native-geolocation-service';
import RNMapView, {Circle, MapPressEvent, Marker} from 'react-native-maps';

import {arrayOf, object} from 'prop-types';

import {getLocationPermission} from '../utils/location';
import {PlaylistSet} from '../types';

interface MapViewProps {
  playlists: PlaylistSet;
  onPress: (e: MapPressEvent) => void;
  coords: GeoCoordinates | null;
}

const propTypes = {
  markers: arrayOf(object),
};

function MapView(props: MapViewProps): React.JSX.Element {
  const {playlists, onPress, coords} = props;

  const [location, setLocation] = useState<GeoPosition | null>(null);

  const mapRef = useRef<RNMapView>(null);

  useEffect(() => {
    getLocationPermission()
      .then(hasPermission => {
        if (!hasPermission) {
          return;
        }

        GeoLocation.getCurrentPosition(
          position => {
            setLocation(position);
            console.log(position);
          },
          error => {
            Alert.alert(`Code ${error.code}`, error.message);
            setLocation(null);
            console.log(error);
          },
          {
            accuracy: {
              android: 'high',
              ios: 'best',
            },
            enableHighAccuracy: true,
            timeout: 15000,
            // maximumAge: 10000,
            distanceFilter: 0,
            forceLocationManager: true,
            showLocationDialog: true,
          },
        );
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (!!location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      });
    }
  }, [location]);

  return (
    <RNMapView
      ref={mapRef}
      initialCamera={{
        altitude: 15000,
        center: {longitude: 23.7603, latitude: 90.4125},
        heading: 0,
        pitch: 0,
        zoom: 11,
      }}
      loadingEnabled
      loadingBackgroundColor="white"
      style={StyleSheet.absoluteFillObject}
      rotateEnabled={false}
      onPress={onPress}>
      {!!coords && (
        <>
          <Marker
            anchor={{x: 0.5, y: 0.6}}
            coordinate={{
              latitude: coords.latitude,
              longitude: coords.longitude,
            }}
            flat
            style={{
              ...(coords.heading !== -1 && {
                transform: [
                  {
                    rotate: `${coords.heading}deg`,
                  },
                ],
              }),
            }}>
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
          </Marker>
          <Circle
            center={{
              latitude: coords.latitude,
              longitude: coords.longitude,
            }}
            radius={coords.accuracy}
            strokeColor="rgba(0, 150, 255, 0.5"
            fillColor="rgba(0, 150, 255, 0.5"
          />
        </>
      )}
      {Object.entries(playlists).map(([key, playlist]) =>
        playlist.songs.map((song, j) => (
          <Marker
            title="Thing"
            key={`playlist-${key}-${j}`}
            coordinate={song.marker}>
            <View style={styles.dotContainer}>
              <View style={{...styles.dot, backgroundColor: playlist.color}} />
            </View>
          </Marker>
        )),
      )}
    </RNMapView>
  );
}

MapView.propTypes = propTypes;

const styles = StyleSheet.create({
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: 'rgb(0, 120, 255)',
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 4,
  },
});

export default MapView;
