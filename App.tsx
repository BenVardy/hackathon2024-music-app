import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import SpotifyAuth, {GetTrack} from './utils/SpotifyAuth';

global.Buffer = global.Buffer || require('buffer').Buffer;

type SectionProps = {
  title: string;
};

function Section({
  title,
  children,
}: React.PropsWithChildren<SectionProps>): React.ReactElement {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {color: isDarkMode ? Colors.white : Colors.black},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {color: isDarkMode ? Colors.light : Colors.dark},
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.ReactElement {
  const isDarkMode = useColorScheme() === 'dark';
  const [token, setToken] = useState<string | null>(null);
  const [trackInfo, setTrackInfo] = useState<any | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{backgroundColor: isDarkMode ? Colors.black : Colors.white}}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
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

export default App;
