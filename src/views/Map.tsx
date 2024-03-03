import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import MapView from '../components/MapView';
import {LatLng, MapPressEvent} from 'react-native-maps';
import GeoLocation, {GeoPosition} from 'react-native-geolocation-service';
import SpotifyAuthModal from '../components/SpotifyAuthModal';
import SongSelect from '../components/SongSelect';
import {phyToLogPx} from '../utils/pixelProblems';
import {ASYNC_KEYS, Song} from '../types';
import {getLocationPermission, closestSong} from '../utils/location';
import {PlayTrackFromSongMarker} from '../utils/SpotifyAuth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../utils/UserContext';

interface SongSelectInfo {
  loc: {
    top: number;
    left: number;
  };
  coordinate: LatLng;
  markerId: string;
  songIdx: number;
  oldPlaylist?: string;
}

function Map(): React.JSX.Element {
  let context = useContext(UserContext);
  const {updateState} = context;
  const playlists = context.playlists || {};

  const [songSelectInfo, setSongSelectInfo] = useState<SongSelectInfo | null>(
    null,
  );
  const [token, setToken] = useState<string | null>();
  const [spotifyAuthVisible, setSpotifyAuthVisible] = useState(true);
  const [location, setLocation] = useState<GeoPosition | null>(null);

  const onMapPress = (e: MapPressEvent) => {
    // Get the x, y position on screen in pixels.
    if (songSelectInfo === null) {
      const {coordinate, position} = e.nativeEvent;

      console.log(position);

      setSongSelectInfo({
        loc: {
          top: phyToLogPx(position.y),
          left: phyToLogPx(position.x),
        },
        coordinate,
        markerId: '',
        songIdx: -1,
      });
    } else {
      setSongSelectInfo(null);
    }
  };

  console.log(playlists);

  const handleSongSelected = async (
    song: Song | null,
    playlist: string | null,
  ) => {
    if (song !== null && playlist !== null && songSelectInfo !== null) {
      // Do the thing!
      const {coordinate, songIdx, oldPlaylist} = songSelectInfo;

      if (oldPlaylist !== undefined) {
        if (songIdx === -1) {
          console.log('Must have a song idx to have an old playlist');
          return;
        }

        const oldPlaylistSongs = playlists[oldPlaylist].songs.slice();
        const songs = oldPlaylistSongs.splice(songIdx, 1);
        const newPlaylistSongs = playlists[playlist].songs.slice();

        updateState({
          playlists: {
            ...playlists,
            [oldPlaylist]: {
              ...playlists[oldPlaylist],
              songs: oldPlaylistSongs,
            },
            [playlist]: {
              ...playlists[playlist],
              songs: newPlaylistSongs.concat(songs),
            },
          },
        });
      } else {
        const playlistSongs = playlists[playlist].songs.slice();
        if (songIdx === -1) {
          playlistSongs.push({song, marker: coordinate});
        } else {
          // TODO: Handle.
        }

        updateState({
          playlists: {
            ...playlists,
            [playlist]: {
              ...playlists[playlist],
              songs: playlistSongs,
            },
          },
        });
      }
    }

    setSongSelectInfo(null);
  };

  useState(() => {
    (async () => {
      try {
        const res = await AsyncStorage.getItem(ASYNC_KEYS.SPOTIFY_TOKEN);
        if (res === null) {
          setSpotifyAuthVisible(true);
        } else {
          setToken(res);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handleSpotifyAuthDone = async () => {
    let authToken = await AsyncStorage.getItem(ASYNC_KEYS.SPOTIFY_TOKEN);
    setToken(authToken);
    setSpotifyAuthVisible(false); // Close the modal
    // PlayTrack(token, '4iV5W9uYEdYUVa79Axb7Rh');
  };

  const watchId = useRef<number | null>(null);

  const startLocationUpdates = async () => {
    const hasPermission = await getLocationPermission();

    if (!hasPermission) {
      return;
    }

    watchId.current = GeoLocation.watchPosition(
      position => {
        setLocation(position);
        console.log(position);
      },
      error => {
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceLocationManager: true,
        showLocationDialog: true,
      },
    );
  };

  const stopLocationUpdates = () => {
    if (watchId.current !== null) {
      GeoLocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  useEffect(() => {
    startLocationUpdates();
    const handleClosestSong = async () => {
      // Create latlng object
      let latlng: LatLng = {
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
      };

      let song = closestSong(latlng, playlists);
      if (!song) {
        return;
      }
      PlayTrackFromSongMarker(token, song);
    };
    handleClosestSong();

    return () => {
      stopLocationUpdates();
    };
  });

  return (
    <>
      <View style={styles.mainContainer}>
        <MapView
          playlists={playlists}
          onPress={onMapPress}
          coords={location?.coords || null}
        />

        {!!token && songSelectInfo && (
          <SongSelect
            // visible={songSelectVis}
            loc={songSelectInfo.loc}
            onSelected={handleSongSelected}
            playlists={playlists}
            token={token}
          />
        )}
      </View>
      {/* Spotify Auth Modal */}
      <SpotifyAuthModal
        visible={spotifyAuthVisible}
        onClose={() => setSpotifyAuthVisible(false)}
        onDone={handleSpotifyAuthDone}
      />

      {/* Button to open Spotify Auth Modal */}
      {/* <Button
        title="Open Spotify Auth"
        onPress={() => setSpotifyAuthVisible(true)}
      /> */}
      {/* Button to get a track */}
      {/* <Button title="Get Track Info" onPress={handleGetTrack} /> */}
      {/* Display the track info */}
      {/* {trackInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Track Info:</Text>
          <ScrollView style={styles.infoScrollView}>
            <Text>{JSON.stringify(trackInfo, null, 2)}</Text>
          </ScrollView>
        </View>
      )} */}
      {/* Input and Button for Search Track */}
      {/* <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Search Term"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Search Track" onPress={handleSearchTrack} />
      </View> */}
      {/* Button to Play Track */}
      {/* <View style={styles.playContainer}>
        <Button title="Play Track" onPress={handlePlayTrack} />
      </View> */}
      {/* Display the search results */}
      {/* {searchResults && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Search Results:</Text>
          <ScrollView style={styles.infoScrollView}>
            {searchResults.tracks.items.map((track: any) => (
              <Text key={track.id}>{track.name}</Text>
            ))}
          </ScrollView>
        </View>
      )} */}
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
  buttonContainer: {
    position: 'absolute',
    padding: 5,
  },
  searchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  playContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  infoScrollView: {
    maxHeight: 200, // Max height for scrollable info
    marginBottom: 10,
  },
});

export default Map;
