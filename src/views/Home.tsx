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
  ImageSourcePropType,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

// These need to be requires.
const IMAGES: {[key: string]: ImageSourcePropType} = {
  gamer: require('../../assets/images/gamer.png'),
  puzzle: require('../../assets/images/puzzle.png'),
  headphones: require('../../assets/images/headphones.png'),
  idea: require('../../assets/images/idea.png'),
  coffee: require('../../assets/images/coffee.png'),
  eightBit: require('../../assets/images/eightball.png'),
  star: require('../../assets/images/star.png'),
  bubble: require('../../assets/images/text.png'),
};

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {usePlaylists} from '../utils/usePlaylists';

function Home(): React.JSX.Element {
  const [playlists, _] = usePlaylists();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
      {Object.entries(playlists).map(([key, item]) => (
        <View style={styles.list} key={`playlist-${key}`}>
          <View style={{...styles.iconContainer, backgroundColor: item.color}}>
            <View style={styles.icons}>
              <Image style={styles.spotify} source={IMAGES[item.image]} />
            </View>
            <Text style={styles.listText}>{item.text}</Text>
            <Text style={styles.songText}>{`Songs: ${item.songs.length}`}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5,
  },
  listText: {
    fontFamily: 'Pixeled',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 12,
    paddingLeft: 20,
  },
  songText: {
    fontFamily: 'Pixeled',
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 12,
    paddingLeft: 20,
  },

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
  iconContainer: {
    padding: 8,
    flexDirection: 'row',
    borderRadius: 10,
    alignContent: 'center',
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
