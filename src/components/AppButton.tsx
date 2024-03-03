import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

interface AppButtonProps {
  title: string;
  onPress?: (event?: any) => void;
}

function AppButton(props: AppButtonProps): React.JSX.Element {
  const {title, onPress} = props;

  const Touchable =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <Touchable onPress={onPress}>
      <View style={styles.buttonView}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: 'black',
  },
});

export default AppButton;
