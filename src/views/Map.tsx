import React, {useState} from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';

import MapView from '../components/MapView';

import SpotifyAuth, {GetTrack} from '../utils/SpotifyAuth';
import {LatLng, MapPressEvent} from 'react-native-maps';
import SongSelect from '../components/SongSelect';
import {phyToLogPx} from '../utils/pixelProblems';
import {usePlaylists} from '../utils/usePlaylists';

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
  const [playlists, setPlaylists] = usePlaylists();
  const [songSelectInfo, setSongSelectInfo] = useState<SongSelectInfo | null>(
    null,
  );
  const [token, setToken] = useState<string | null>();
  const [trackInfo, setTrackInfo] = useState<any | null>(null);

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

  const handleSongSelected = async (
    song: string | null,
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

        setPlaylists({
          ...playlists,
          [oldPlaylist]: {
            ...playlists[oldPlaylist],
            songs: oldPlaylistSongs,
          },
          [playlist]: {
            ...playlists[playlist],
            songs: newPlaylistSongs.concat(songs),
          },
        });
      } else {
        const playlistSongs = playlists[playlist].songs.slice();
        if (songIdx === -1) {
          playlistSongs.push({marker: coordinate});
        } else {
          // TODO: Handle.
        }

        setPlaylists({
          ...playlists,
          [playlist]: {
            ...playlists[playlist],
            songs: playlistSongs,
          },
        });
      }
    }

    setSongSelectInfo(null);
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
        <MapView playlists={playlists} onPress={onMapPress} />

        {songSelectInfo && (
          <SongSelect
            // visible={songSelectVis}
            loc={songSelectInfo.loc}
            onSelected={handleSongSelected}
            playlists={playlists}
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
