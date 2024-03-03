import React, {useState} from 'react';
import {StyleSheet, View, Modal} from 'react-native';
import AppButton from './AppButton';
import IconButton from './IconButton';
import {ScrollView} from 'react-native-gesture-handler';
import PlaylistList from './PlaylistList';
import {PlaylistSet, Song} from '../types';
import SongFinder from './SongFinder';

interface SongSelectProps {
  loc: {
    top: number;
    left: number;
  };
  // visible: boolean;
  onSelected: (song: Song | null, playlist: string | null) => void;
  playlists: PlaylistSet;
  token: string;
}

function SongSelect(props: SongSelectProps): React.JSX.Element {
  const {
    // visible,
    loc,
    onSelected,
    playlists,
    token,
  } = props;

  const [songsVis, setSongsVis] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [playlistsVis, setPlaylistsVis] = useState<boolean>(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const handleSongPress = (song: Song) => {
    setSelectedSong(song);
    setSongsVis(false);
  };

  const handlePlaylistPress = (playlist: string) => {
    setSelectedPlaylist(playlist);
    setPlaylistsVis(false);
  };

  return (
    <>
      <View style={{...styles.container, top: loc.top, left: loc.left}}>
        <IconButton
          iconName="close"
          onPress={() => onSelected(selectedSong, selectedPlaylist)}
        />
        <AppButton
          title={
            selectedSong !== null ? `Song: ${selectedSong.name}` : 'Select Song'
          }
          onPress={() => setSongsVis(true)}
        />
        <AppButton
          title={
            selectedPlaylist !== null
              ? `Playlist: ${playlists[selectedPlaylist].text}`
              : 'Select Playlist'
          }
          onPress={() => setPlaylistsVis(true)}
        />
      </View>
      <Modal visible={songsVis} transparent={true} animationType="slide">
        <View style={styles.pusher} />
        <View style={styles.modalContainer}>
          <IconButton iconName="close" onPress={() => setSongsVis(false)} />
          <SongFinder onSongPick={handleSongPress} token={token} />
        </View>
      </Modal>
      <Modal visible={playlistsVis} transparent={true} animationType="slide">
        <View style={styles.pusher} />
        <View style={styles.modalContainer}>
          <IconButton iconName="close" onPress={() => setPlaylistsVis(false)} />
          <ScrollView>
            <PlaylistList
              onPlaylistPress={handlePlaylistPress}
              playlists={playlists}
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    rowGap: 4,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  pusher: {
    flex: 1,
  },
  modalContainer: {
    height: 500,
    // marginTop: Dimensions.get('window').height - 500,
    backgroundColor: 'white',
  },
});

export default SongSelect;
