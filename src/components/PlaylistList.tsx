import React from 'react';
import {PlaylistSet} from '../types';
import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';

interface PlaylistListProps {
  playlists: PlaylistSet;
  onPlaylistPress: (playlist: string) => void;
}

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

function PlaylistList(props: PlaylistListProps): React.JSX.Element {
  const {playlists, onPlaylistPress} = props;

  return (
    <>
      {Object.entries(playlists).map(([key, item]) => (
        <TouchableOpacity
          key={`playlist-${key}`}
          onPress={() => onPlaylistPress(key)}
          style={styles.list}>
          {/* <View > */}
          <View style={{...styles.iconContainer, backgroundColor: item.color}}>
            <View style={styles.icons}>
              <Image style={styles.spotify} source={IMAGES[item.image]} />
            </View>
            <Text style={styles.listText}>{item.text}</Text>
            <Text style={styles.songText}>{`Songs: ${item.songs.length}`}</Text>
          </View>
          {/* </View> */}
        </TouchableOpacity>
      ))}
    </>
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
  iconContainer: {
    padding: 8,
    flexDirection: 'row',
    borderRadius: 10,
    alignContent: 'center',
  },
  icons: {
    paddingLeft: 10,
  },
  spotify: {
    height: 45,
    width: 45,
  },
});

export default PlaylistList;
