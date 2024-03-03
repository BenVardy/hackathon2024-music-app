import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import {WebView} from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_KEYS, SongMarker} from '../types';

global.Buffer = require('buffer').Buffer;

interface SpotifyAuthProps {
  onDone: () => void;
}

const SpotifyAuth = (props: SpotifyAuthProps) => {
  const {onDone} = props;
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [webViewVisible, setWebViewVisible] = useState(true);

  // Spotify API credentials
  const client_id = 'ff330d3bbc254f678bdd951b592ee810';
  const redirect_uri = 'http://localhost/';
  /* eslint-disable-next-line dot-notation */
  const client_secret = process.env['SPOTIFY_CLIENT_SECRET'];

  // Spotify authorization URL
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state`;

  // Handle URL change in WebView
  const handleNavigationStateChange = (event: any) => {
    const url = event.url;
    if (url.startsWith(redirect_uri)) {
      setWebViewVisible(false); // Hide the WebView
      const params = url.split('?')[1];
      const code = params.split('code=')[1];
      setAuthCode(code);
      console.log('Authorization Code:', code);
      exchangeCodeForToken(code);
    }
  };

  // Exchange authorization code for access token
  const exchangeCodeForToken = async (code: string) => {
    // Make a POST request to Spotify's token endpoint
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          new Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&client_id=${client_id}`,
    });

    if (!response.ok) {
      console.error('Failed to exchange code for token: ', response);
      return;
    }

    const data = await response.json();
    const accessToken: string = data.access_token;
    console.log('Access Token:', accessToken);

    // Store access token in AsyncStorage
    await AsyncStorage.setItem(ASYNC_KEYS.SPOTIFY_TOKEN, accessToken);
    onDone();
  };

  return (
    <View style={{flex: 1}}>
      {webViewVisible && (
        <WebView
          source={{uri: authUrl}}
          onNavigationStateChange={handleNavigationStateChange}
        />
      )}
    </View>
  );
};

export const GetTrack = async (token: string, trackId: string) => {
  const options = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      options,
    );
    if (!response.ok) {
      throw new Error('Failed to get track information');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching track information:', error);
    throw error;
  }
};

export const SearchTrack = async (token: string, query: string) => {
  const options = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track`,
      options,
    );
    if (!response.ok) {
      throw new Error('Failed to search for track');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching for track:', error);
    throw error;
  }
};

export const PlayTrack = async (token: string, trackId: string) => {
  const options = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: [`spotify:track:${trackId}`],
    }),
  };

  try {
    const response = await fetch(
      'https://api.spotify.com/v1/me/player/play',
      options,
    );
    if (!response.ok) {
      throw new Error('Failed to play track');
    }
  } catch (error) {
    console.error('Error playing track:', error);
    throw error;
  }
};

export const GetAvailableDevices = async (token: string) => {
  const options = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  try {
    const response = await fetch(
      'https://api.spotify.com/v1/me/player/devices',
      options,
    );
    if (!response.ok) {
      throw new Error('Failed to get available devices');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting available devices:', error);
    throw error;
  }
};

export const PlayTrackFromSongMarker = async (
  token: string,
  marker: SongMarker,
  currentSongID?: string,
) => {
  try {
    if (currentSongID && currentSongID === marker.song.id) {
      console.log('Song is already playing');
      return;
    }
    await PlayTrack(token, marker.song.id);
  } catch (error) {
    console.error('Error playing track from song marker:', error);
  }
};

export default SpotifyAuth;
