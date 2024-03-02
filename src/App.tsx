import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View, Text, PixelRatio} from 'react-native';

import MapView from './components/MapView';
import {ASYNC_KEYS, MarkerT} from './types';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SpotifyAuth, {GetTrack} from './utils/SpotifyAuth';
import {MapPressEvent} from 'react-native-maps';
import SongSelect from './components/SongSelect';
import {phyToLogPx} from './utils/pixelProblems';

interface SongSelectInfo {
  loc: {
    top: number;
    left: number;
  };
  markerId: string;
}

let id = 0;

function App(): React.JSX.Element {
  const [markers, setMarkers] = useState<MarkerT[]>([]);
  const [songSelectInfo, setSongSelectInfo] = useState<SongSelectInfo | null>(
    null,
  );
  const [token, setToken] = useState<string | null>();
  const [trackInfo, setTrackInfo] = useState<any | null>(null);

  const onMapPress = (e: MapPressEvent) => {
    // Get the x, y position on screen in pixels.
    const {position} = e.nativeEvent;

    console.log(position);

    setSongSelectInfo({
      loc: {
        top: phyToLogPx(position.y),
        left: phyToLogPx(position.x),
      },
      markerId: '',
    });

    // setMarkers([
    //   ...markers,
    //   {
    //     coordinate: e.nativeEvent.coordinate,
    //     key: `${id++}`,
    //   },
    // ]);
  };

  const handleSongSelected = (song: string | null) => {
    setSongSelectInfo(null);
  };

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const markersVal = await AsyncStorage.getItem(ASYNC_KEYS.MARKERS);
        if (markersVal !== null) {
          setMarkers(JSON.parse(markersVal));
        }
      } catch (e) {
        // error.
        console.log('Error loading data.');
        console.log(e);
      }
    };

    loadMarkers();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem(ASYNC_KEYS.MARKERS, JSON.stringify(markers));
      } catch (e) {
        // error.
        console.log('Error saving data.');
        console.log(e);
      }
    };

    storeData();
  }, [markers]);

  const handleClearMarkers = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_KEYS.MARKERS);
      setMarkers([]);
    } catch (e) {
      console.log('Error removing markers');
      console.log(e);
    }
  };

  const handleGetToken = async () => {
    try {
      const fetchedToken = await SpotifyAuth();
      setToken(fetchedToken);
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
    }
  };

  const handleGetTrack = async () => {
    try {
      if (!token) {
        console.error('Token not available. Fetch token first.');
        return;
      }
      const trackId = '11dFghVXANMlKmJXsNCbNl';
      const fetchedTrackInfo = await GetTrack(token, trackId);
      setTrackInfo(fetchedTrackInfo);
    } catch (error) {
      console.error('Error fetching track information:', error);
    }
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <MapView markers={markers} onPress={onMapPress} />
        <View style={styles.buttonContainer}>
          <Button title="Clear Markers" onPress={handleClearMarkers} />
        </View>

        {songSelectInfo && (
          <SongSelect
            // visible={songSelectVis}
            loc={songSelectInfo.loc}
            onSelected={handleSongSelected}
          />
        )}
      </View>
      {/* Button to get the Spotify token */}
      <Button title="Get Spotify Token" onPress={handleGetToken} />

      {/* Display the Spotify token */}
      {token && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Spotify Token:</Text>
          <Text>{token}</Text>
        </View>
      )}

      {/* Button to get a track */}
      <Button title="Get Track Info" onPress={handleGetTrack} />

      {/* Display the track info */}
      {trackInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Track Info:</Text>
          <Text>{JSON.stringify(trackInfo, null, 2)}</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    padding: 5,
  },
  infoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  infoText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default App;
