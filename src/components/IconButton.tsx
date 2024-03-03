import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface IconButtonProps {
  iconName: string;
  onPress?: (e: any) => void;
}

function IconButton(props: IconButtonProps): React.JSX.Element {
  let {iconName, onPress} = props;

  const Touchable =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <Touchable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.touchable}>
          <Icon style={styles.icon} name={iconName} />
        </View>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  touchable: {
    padding: 10,
    borderRadius: 2,
    // flex: 1,
    alignSelf: 'center',
  },
  icon: {
    color: 'black',
  },
});

export default IconButton;
