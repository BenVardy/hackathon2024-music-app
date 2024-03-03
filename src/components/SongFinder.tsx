import React, {useState} from 'react';
import {
  TextInput,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
// import AppButton from './AppButton';
import {SearchTrack} from '../utils/SpotifyAuth';
import {Song} from '../types';

interface SongFinderProps {
  onSongPick: (song: Song) => void;
  token: string;
  playlistColor?: string;
}

function SongFinder(props: SongFinderProps): React.JSX.Element {
  const {token, onSongPick} = props;
  let playlistColor = props.playlistColor || '#c7dcff';

  const [songs, setSongs] = useState<Song[] | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTrack = async () => {
    const searchResults = await SearchTrack(token, searchTerm);

    setSongs(
      searchResults.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
      })),
    );
  };

  return (
    <View>
      <TextInput
        style={styles.text}
        placeholder="Enter Search Term"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Search" onPress={handleSearchTrack} />
      {songs && (
        <ScrollView>
          {songs.map(song => (
            <TouchableOpacity key={song.id} onPress={() => onSongPick(song)}>
              <View
                style={{...styles.container, backgroundColor: playlistColor}}>
                <Text style={styles.text}>Name: {song.name}</Text>
                <Text style={styles.text}>Artist: {song.artist}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  container: {
    padding: 4,
    margin: 4,
    // backgroundColor: '#c7dcff',
    width: '100%',
  },
  searchBtn: {
    padding: 4,
  },
});

export default SongFinder;
