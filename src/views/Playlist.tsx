import React from 'react';
import {Playlist as TPlaylist} from '../types';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {getImages} from '../utils/getImages';

const IMAGES = getImages();

function Playlist({route}: any): React.JSX.Element {
  const playlist: TPlaylist = route.params.playlist;

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Image style={styles.spotify} source={IMAGES[playlist.image]} />
        <Text style={styles.headText}>{playlist.text}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.songsContainer}>
        {playlist.songs.length === 0 ? (
          <Text style={{...styles.text, alignSelf: 'center'}}>
            No songs in playlist
          </Text>
        ) : (
          playlist.songs.map(({song}) => (
            <View
              key={song.id}
              style={{
                ...styles.songContainer,
                backgroundColor: playlist.color,
              }}>
              <Text style={styles.text}>Title: {song.name}</Text>
              <Text style={styles.text}>Artist: {song.artist}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    rowGap: 4,
    alignContent: 'space-between',
    paddingHorizontal: 20,
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  songsContainer: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    // justifyContent: 'center',
    flexBasis: 1,
    rowGap: 4,
  },
  spotify: {
    height: 60,
    width: 60,
  },
  headText: {
    paddingLeft: 8,
    color: 'black',
    fontFamily: 'Pixeled',
    fontSize: 28,
  },
  text: {
    color: 'black',
    fontFamily: 'Pixeled',
    fontSize: 12,
  },
  songContainer: {
    padding: 8,
    flexDirection: 'column',
    borderRadius: 10,
    alignContent: 'center',
  },
});

export default Playlist;
