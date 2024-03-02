import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import AppButton from './AppButton';
import IconButton from './IconButton';

interface SongSelectProps {
  loc: {
    top: number;
    left: number;
  };
  // visible: boolean;
  onSelected: (song: string | null) => void;
}

const defaultProps = {
  loc: {
    top: 0,
    left: 0,
  },
};

function SongSelect(props: SongSelectProps): React.JSX.Element {
  const [playlistsVis, setPlaylistsVis] = useState<boolean>(false);

  const {
    // visible,
    loc,
    onSelected,
  } = props;

  const handlePlaylistBtn = () => {
    setPlaylistsVis(true);
  };
  const handlePlaylistClose = () => {
    setPlaylistsVis(false);
  };

  return (
    <>
      <View style={{...styles.container, top: loc.top, left: loc.left}}>
        <TouchableOpacity onPress={() => onSelected(null)}>
          <IconButton iconName="close" />
        </TouchableOpacity>
        <AppButton title="Select Song" />
        <AppButton title="Select Playlist" onPress={handlePlaylistBtn} />
      </View>
      <Modal visible={playlistsVis} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <IconButton iconName="close" onPress={handlePlaylistClose} />
        </View>
      </Modal>
    </>
  );
}

SongSelect.defaultProps = defaultProps;

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

  modalContainer: {
    height: 500,
    marginTop: Dimensions.get('window').height - 500,
    backgroundColor: 'white',
  },
});

console.log();

export default SongSelect;
