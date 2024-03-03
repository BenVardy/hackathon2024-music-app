import React, {useState} from 'react';
import {
  TextInput,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import AppButton from './AppButton';
import {SearchTrack} from '../utils/SpotifyAuth';
import {Song} from '../types';

interface SongFinderProps {
  onSongPick: (song: Song) => void;
  token: string;
}

function SongFinder(props: SongFinderProps): React.JSX.Element {
  const {token, onSongPick} = props;

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
        placeholder="Enter Search Term"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <AppButton title="Search" onPress={handleSearchTrack} />
      {songs && (
        <ScrollView>
          {songs.map(song => (
            <TouchableOpacity key={song.id} onPress={() => onSongPick(song)}>
              <View>
                <Text>Name: {song.name}</Text>
                <Text>Artist: {song.artist}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default SongFinder;
