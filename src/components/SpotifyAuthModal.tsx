import React, {useState} from 'react';
import {Button, Modal, View, LogBox} from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_KEYS} from '../types';

global.Buffer = require('buffer').Buffer;

interface SpotifyAuthProps {
  onDone: () => void;
}

const SpotifyAuthModal = ({visible, onClose, onDone}: any) => {
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
    LogBox.ignoreLogs(['Encountered an error loading page']);
    const url = event.url;
    if (url.startsWith(redirect_uri)) {
      const params = url.split('?')[1];
      const code = params.split('code=')[1];
      setAuthCode(code);
      exchangeCodeForToken(code);
      onDone();
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

    // if (!response.ok) {
    //   console.error('Failed to exchange code for token: ', response);
    //   return;
    // }

    const data = await response.json();
    const accessToken: string = data.access_token;
    console.log('Access Token:', accessToken);

    // Store access token in AsyncStorage
    if (accessToken) {
      await AsyncStorage.setItem(ASYNC_KEYS.SPOTIFY_TOKEN, accessToken);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => onClose()}>
      <View style={{flex: 1}}>
        <WebView
          source={{uri: authUrl}}
          onNavigationStateChange={handleNavigationStateChange}
        />
        {authCode && (
          <Button
            title="Exchange Code for Token"
            onPress={() => exchangeCodeForToken(authCode)}
          />
        )}
      </View>
    </Modal>
  );
};

export default SpotifyAuthModal;
