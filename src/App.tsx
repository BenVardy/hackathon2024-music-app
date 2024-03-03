import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './views/Home';
import Map from './views/Map';
import Playlist from './views/Playlist';
import {Playlist as TPlaylist} from './types';

export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  Playlist: {playlist: TPlaylist};
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Playlist" component={Playlist} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
