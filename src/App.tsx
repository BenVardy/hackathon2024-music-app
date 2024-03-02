import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';

import MapView from './components/MapView';
import {ASYNC_KEYS, MarkerT} from './types';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SpotifyAuth, {
  GetTrack,
  SearchTrack,
  PlayTrack,
} from './utils/SpotifyAuth';

let id = 0;

function App(): React.JSX.Element {
  const [markers, setMarkers] = useState<MarkerT[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [trackInfo, setTrackInfo] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any | null>(null);

  const onMapPress = (e: any) => {
    setMarkers([
      ...markers,
      {
        coordinate: e.nativeEvent.coordinate,
        key: `${id++}`,
      },
    ]);
  };

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const markersVal = await AsyncStorage.getItem(ASYNC_KEYS.MARKERS);
        if (markersVal !== null) {
          setMarkers(JSON.parse(markersVal));
        }
      } catch (e) {
        // error.
        console.log('Error loading data.');
        console.log(e);
      }
    };

    loadMarkers();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem(ASYNC_KEYS.MARKERS, JSON.stringify(markers));
      } catch (e) {
        // error.
        console.log('Error saving data.');
        console.log(e);
      }
    };

    storeData();
  }, [markers]);

  const handleClearMarkers = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_KEYS.MARKERS);
      setMarkers([]);
    } catch (e) {
      console.log('Error removing markers');
      console.log(e);
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

  const handleSearchTrack = async () => {
    try {
      if (!token) {
        console.error('Token not available. Fetch token first.');
        return;
      }
      if (!searchTerm) {
        Alert.alert('Search Term Required', 'Please enter a search term.');
        return;
      }
      const searchResults = await SearchTrack(token, searchTerm);
      setTrackInfo(null); // Clear previous track info
      setSearchResults(searchResults);
    } catch (error) {
      console.error('Error searching track:', error);
    }
  };

  const handlePlayTrack = async () => {
    try {
      if (!token) {
        console.error('Token not available. Fetch token first.');
        return;
      }
      if (
        !searchResults ||
        !searchResults.tracks ||
        searchResults.tracks.length === 0
      ) {
        console.error('No search results available.');
        return;
      }
      const firstTrackId = searchResults.tracks.items[0].id;
      await PlayTrack(token, firstTrackId);
      console.log('Track is playing...');
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <MapView markers={markers} onPress={onMapPress} />
        <View style={styles.buttonContainer}>
          <Button title="Clear Markers" onPress={handleClearMarkers} />
        </View>
      </View>

      {/* Button to get the Spotify token */}
      <Button title="Get Spotify Token" onPress={handleGetToken} />

      {/* Display the Spotify token */}
      {token && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Spotify Token:</Text>
          <ScrollView style={styles.infoScrollView}>
            <Text>{token}</Text>
          </ScrollView>
        </View>
      )}

      {/* Button to get a track */}
      <Button title="Get Track Info" onPress={handleGetTrack} />

      {/* Display the track info */}
      {trackInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Track Info:</Text>
          <ScrollView style={styles.infoScrollView}>
            <Text>{JSON.stringify(trackInfo, null, 2)}</Text>
          </ScrollView>
        </View>
      )}

      {/* Input and Button for Search Track */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Search Term"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Search Track" onPress={handleSearchTrack} />
      </View>

      {/* Button to Play Track */}
      <View style={styles.playContainer}>
        <Button title="Play Track" onPress={handlePlayTrack} />
      </View>

      {/* Display the search results */}
      {searchResults && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Search Results:</Text>
          <ScrollView style={styles.infoScrollView}>
            {searchResults.tracks.items.map((track: any) => (
              <Text key={track.id}>{track.name}</Text>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    padding: 5,
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

export default App;
