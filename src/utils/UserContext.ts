import React from 'react';
import {AppState} from '../types';

const defaultState: AppState = {
  playlists: {},
  updateState: (_?: Partial<AppState>) => {},
};

export const UserContext = React.createContext<AppState>(defaultState);
