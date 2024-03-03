import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';

import MapView from '../components/MapView';
import {ASYNC_KEYS, DEFAULT_PLAYLISTS, PlaylistSet} from '../types';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SpotifyAuth, {GetTrack} from '../utils/SpotifyAuth';
import {LatLng, MapPressEvent} from 'react-native-maps';
import SongSelect from '../components/SongSelect';
import {phyToLogPx} from '../utils/pixelProblems';

interface SongSelectInfo {
  loc: {
    top: number;
    left: number;
  };
  coordinate: LatLng;
  markerId: string;
}

function Map(): React.JSX.Element {
  const [playlists, setPlaylists] = useState<PlaylistSet>({});
  const [songSelectInfo, setSongSelectInfo] = useState<SongSelectInfo | null>(
    null,
  );
  const [token, setToken] = useState<string | null>();
  const [trackInfo, setTrackInfo] = useState<any | null>(null);

  const onMapPress = (e: MapPressEvent) => {
    // Get the x, y position on screen in pixels.
    const {coordinate, position} = e.nativeEvent;

    console.log(position);

    setSongSelectInfo({
      loc: {
        top: phyToLogPx(position.y),
        left: phyToLogPx(position.x),
      },
      coordinate,
      markerId: '',
    });
  };

  const handleSongSelected = async (
    song: string | null,
    playlist: string | null,
  ) => {
    setSongSelectInfo(null);

    if (song !== null && playlist !== null && songSelectInfo !== null) {
      // Do the thing!
      const {coordinate} = songSelectInfo;
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

  // Get the things on load.
  useEffect(() => {
    (async () => {
      try {
        let newPlaylists: PlaylistSet;

        const playlistsJSON = await AsyncStorage.getItem(ASYNC_KEYS.PLAYLISTS);
        if (playlistsJSON !== null) {
          newPlaylists = JSON.parse(playlistsJSON);
        } else {
          // Set to default playlists.
          newPlaylists = DEFAULT_PLAYLISTS;

          await AsyncStorage.setItem(
            ASYNC_KEYS.PLAYLISTS,
            JSON.stringify(newPlaylists),
          );
        }

        setPlaylists(newPlaylists);
      } catch (e) {
        console.log('Error getting playlists');
        console.log(e);
      }
    })();
  }, []);

  return (
    <>
      <View style={styles.mainContainer}>
        <MapView playlists={playlists} onPress={onMapPress} />

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

export default Map;
