/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//https://www.makeuseof.com/react-native-custom-fonts-usage-guide/

import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

// These need to be requires.

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {usePlaylists} from '../utils/usePlaylists';
import PlaylistList from '../components/PlaylistList';

function Home(): React.JSX.Element {
  const [playlists, _] = usePlaylists();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePlaylistPress = (playlistName: string) => {
    navigation.navigate('Playlist', {
      playlist: playlists[playlistName],
    });
  };

  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>PIXEL PATH</Text>
        <Text style={styles.with}>with</Text>
        <View style={styles.spotifyView}>
          <Image
            style={styles.spotify}
            source={require('../../assets/images/spotify.png')}
          />
        </View>
      </View>

      <Text style={styles.smallHeader}>ADD TO MAP:</Text>
      <View style={styles.worldView}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Map')}>
          <Image
            style={styles.world}
            source={require('../../assets/images/world.png')}
          />
        </TouchableWithoutFeedback>
      </View>
      <Text style={styles.playlistHeader}>YOUR PLAYLISTS:</Text>
      <PlaylistList
        onPlaylistPress={handlePlaylistPress}
        playlists={playlists}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallHeader: {
    fontFamily: 'Pixeled',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 12,
    paddingLeft: 20,
    paddingRight: 20,
  },
  playlistHeader: {
    fontFamily: 'Pixeled',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 12,
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
  },
  header: {
    fontFamily: 'Pixeled',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 28,
    paddingLeft: 20,
    paddingRight: 10,
  },
  spotify: {
    height: 45,
    width: 45,
  },
  icons: {
    paddingLeft: 10,
  },
  world: {
    height: 300,
    width: '100%',
    borderRadius: 10,
  },
  spotifyView: {
    paddingTop: 10,
    paddingLeft: 10,
  },
  worldView: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  background: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  with: {
    fontFamily: 'Pixeled',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 10,
  },
});

export default Home;
