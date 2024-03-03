import React, {useState} from 'react';
import {StyleSheet, View, Modal, Dimensions} from 'react-native';
import AppButton from './AppButton';
import IconButton from './IconButton';
import {ScrollView} from 'react-native-gesture-handler';
import PlaylistList from './PlaylistList';
import {PlaylistSet} from '../types';

interface SongSelectProps {
  loc: {
    top: number;
    left: number;
  };
  // visible: boolean;
  onSelected: (song: string | null, playlist: string | null) => void;
  playlists: PlaylistSet;
}

function SongSelect(props: SongSelectProps): React.JSX.Element {
  const [playlistsVis, setPlaylistsVis] = useState<boolean>(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const {
    // visible,
    loc,
    onSelected,
    playlists,
  } = props;

  const handlePlaylistBtn = () => {
    setPlaylistsVis(true);
  };
  const handlePlaylistClose = () => {
    setPlaylistsVis(false);
  };

  const handlePlaylistPress = (playlist: string) => {
    setSelectedPlaylist(playlist);
    handlePlaylistClose();
  };

  return (
    <>
      <View style={{...styles.container, top: loc.top, left: loc.left}}>
        <IconButton
          iconName="close"
          onPress={() => onSelected(null, selectedPlaylist)}
        />
        <AppButton title="Select Song" />
        <AppButton
          title={
            selectedPlaylist !== null
              ? `Playlist: ${playlists[selectedPlaylist].text}`
              : 'Select Playlist'
          }
          onPress={handlePlaylistBtn}
        />
      </View>
      <Modal visible={playlistsVis} transparent={true} animationType="slide">
        <View style={styles.pusher} />
        <View style={styles.modalContainer}>
          <IconButton iconName="close" onPress={handlePlaylistClose} />
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

console.log();

export default SongSelect;
