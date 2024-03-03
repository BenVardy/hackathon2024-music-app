import React, {useEffect, useState} from 'react';
import {AppState, DEFAULT_PLAYLISTS, PlaylistSet} from '../types';
import {UserContext} from '../utils/UserContext';

interface UserContextProviderProps {
  children: React.ReactNode;
}

function UserContextProvider(
  props: UserContextProviderProps,
): React.JSX.Element {
  const [state, setState] = useState({});

  const updateState = (newState?: Partial<AppState>) => {
    setState({...state, ...newState});
  };

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

        updateState({playlists: newPlaylists});
      } catch (e) {
        console.log('Error getting playlists');
        console.log(e);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{...state, updateState}}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
