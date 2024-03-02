import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';

import MapView from './components/MapView';
import {ASYNC_KEYS, MarkerT} from './types';

import AsyncStorage from '@react-native-async-storage/async-storage';

let id = 0;

function App(): React.JSX.Element {
  const [markers, setMarkers] = useState<MarkerT[]>([]);

  const onMapPress = (e: any) => {
    setMarkers([
      ...markers,
      {
        coordinate: e.nativeEvent.coordinate,
        key: `${id++}`,
      },
    ]);
  };

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const markersVal = await AsyncStorage.getItem(ASYNC_KEYS.MARKERS);
        if (markersVal !== null) {
          setMarkers(JSON.parse(markersVal));
        }
      } catch (e) {
        // error.
        console.log('Error loading data.');
        console.log(e);
      }
    };

    loadMarkers();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem(ASYNC_KEYS.MARKERS, JSON.stringify(markers));
      } catch (e) {
        // error.
        console.log('Error saving data.');
        console.log(e);
      }
    };

    storeData();
  }, [markers]);

  const handleClearMarkers = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_KEYS.MARKERS);
      setMarkers([]);
    } catch (e) {
      console.log('Error removing markers');
      console.log(e);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <MapView markers={markers} onPress={onMapPress} />
      <View style={styles.buttonContainer}>
        <Button title="Clear Markers" onPress={handleClearMarkers} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    padding: 5,
  },
});

export default App;
