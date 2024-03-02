import {authorize} from 'react-native-app-auth';

const config = {
  clientId: 'ff330d3bbc254f678bdd951b592ee810', // available on the app page
  redirectUrl: 'com.pixelpath:/oauth', // the redirect you defined after creating the app
  scopes: ['user-read-email', 'playlist-modify-public', 'user-read-private'], // the scopes you need to access
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'http://138.251.29.98:3000/swap',
  },
};
const SpotifyAuth = async () => {
  try {
    const result = await authorize(config);
    console.log('Auth result', result);
    return result;
  } catch (error) {
    console.error('SpotifyAuth error', error);
  }
};

export default SpotifyAuth;
