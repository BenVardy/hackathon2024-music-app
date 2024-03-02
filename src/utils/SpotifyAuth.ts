global.Buffer = require('buffer').Buffer;

const SpotifyAuth = async (): Promise<string> => {
  const client_id = 'ff330d3bbc254f678bdd951b592ee810';
  /* eslint-disable-next-line dot-notation */
  const client_secret = process.env['SPOTIFY_CLIENT_SECRET'];

  if (!client_secret) {
    throw new Error('SPOTIFY_CLIENT_SECRET environment variable is not set');
  }

  const authOptions = {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }).toString(),
  };

  try {
    const response = await fetch(
      'https://accounts.spotify.com/api/token',
      authOptions,
    );
    if (!response.ok) {
      throw new Error('Failed to authenticate with Spotify');
    }

    const data = await response.json();
    const token = data.access_token;
    return token;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    throw error;
  }
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
export default SpotifyAuth;
