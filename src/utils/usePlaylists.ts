import {useEffect, useState} from 'react';
import {ASYNC_KEYS, DEFAULT_PLAYLISTS, PlaylistSet} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePlaylists(): [
  PlaylistSet,
  React.Dispatch<React.SetStateAction<PlaylistSet>>,
] {
  const [playlists, setPlaylists] = useState<PlaylistSet>({});

  useEffect(() => {
    (async () => {
      try {
        let newPlaylists: PlaylistSet;

        // const playlistsJSON = await AsyncStorage.getItem(ASYNC_KEYS.PLAYLISTS);
        const playlistsJSON = null;
        if (playlistsJSON !== null) {
          newPlaylists = JSON.parse(playlistsJSON);
        } else {
          // Set to default playlists.
          newPlaylists = DEFAULT_PLAYLISTS;

          // await AsyncStorage.setItem(
          //   ASYNC_KEYS.PLAYLISTS,
          //   JSON.stringify(newPlaylists),
          // );
        }

        setPlaylists(newPlaylists);
      } catch (e) {
        console.log('Error getting playlists');
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // await AsyncStorage.setItem(
        //   ASYNC_KEYS.PLAYLISTS,
        //   JSON.stringify(playlists),
        // );
      } catch (e) {
        console.log('Error setting playlists');
        console.log(e);
      }
    })();
  }, [playlists]);

  return [playlists, setPlaylists];
}
