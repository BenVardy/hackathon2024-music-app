/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//https://www.makeuseof.com/react-native-custom-fonts-usage-guide/ 

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  ListRenderItem,
  FlatList,
  ImageSourcePropType,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface DataItem {
  key: string;
  text: string;
  image: ImageSourcePropType;
  songs: number;
  color: string;
}

import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator<RootStackParamList>();


const Gamer = require('../assets/images/gamer.png');
const Puzzle = require('../assets/images/puzzle.png');
const Headphones = require('../assets/images/headphones.png');
const Idea = require('../assets/images/idea.png');
const Coffee = require('../assets/images/coffee.png');
const eightBit = require('../assets/images/eightball.png');
const Star = require('../assets/images/star.png');
const Bubble = require('../assets/images/text.png');


const dataList: DataItem[] = [
  {key: '1', text: 'Gamer', image:Gamer, songs: 0, color:"#c7dcff"},
  {key: '2', text: 'Puzzle', image:Puzzle, songs: 0, color:"#fbffc7"},
  {key: '3', text: 'Headphones', image:Headphones, songs: 0, color:"#edc7ff"},
  {key: '4', text: 'Idea', image:Idea, songs: 0, color:"#d6ffc7"},
  {key: '5', text: 'Coffee', image:Coffee, songs: 0, color:"#ffd1c7"},
  {key: '6', text: 'Star', image:Star, songs: 0, color:"#ffcb8c"},
  {key: '7', text: 'Text', image:Bubble, songs: 0, color:"#8cafff"},
  {key: '8', text: '8bit', image:eightBit, songs: 0, color:"#ff8cb4"},  
];

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

const Home: React.FC = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.background}>
      
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>PIXEL PATH</Text>
        <Text style={styles.with}>with</Text>
        <View style={styles.spotifyview}>
            <Image style={styles.spotify} source={require('../assets/images/spotify.png')} />
          
        </View>
      </View>
      
      <Text style={styles.smallheader}>ADD TO MAP:</Text>
      <View style={styles.worldview}>
      <TouchableOpacity onPress={() => navigation.navigate('Map')}>
        <Image style={styles.world} source={require('../assets/images/world.png') as ImageSourcePropType} />
        </TouchableOpacity>
      </View>
      <Text style={styles.playlistheader}>YOUR PLAYLISTS:</Text>
      {dataList.map((item, i) => (
      
        <View style={styles.list} key={`data-${i}`}>
          <View style={{backgroundColor: item.color, padding: 8, 
      flexDirection: "row", 
      borderRadius: 10,
      alignContent: 'center'}}>
            <View style={styles.icons}>
            <Image style={styles.spotify} source={item.image} />
            </View>
            <Text style={styles.listText}>{item.text}</Text>
            <Text style={styles.songText}>{"Songs: " + item.songs}</Text>
          </View>
        </View>
        
        
      ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingLeft: 20,
    paddingRight: 20, 
    marginBottom: 5
  },
  listText: {
    fontFamily: "Pixeled",
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 12,
    paddingLeft: 20
  },
  songText: {
    fontFamily: "Pixeled",
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 12,
    paddingLeft: 20
  },
  container: {
    flexDirection: "row",
    alignItems: 'center',
  },
  smallheader: {
    fontFamily: "Pixeled",
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 12,
    paddingLeft: 20,
    paddingRight: 20,
  },
  playlistheader: {
    fontFamily: "Pixeled",
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 12,
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10
  },
  header: {
    fontFamily: "Pixeled",
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 28,
    paddingLeft: 20,
    paddingRight: 10,
  },
  spotify: {
    height: 45,
    width: 45,
  },
  icons: {
    paddingLeft: 10,
  },
  world: {
    height: 300,
    width: '100%',
    borderRadius: 10
  },
  spotifyview: {
    paddingTop: 10,
    paddingLeft: 10,

  },
  worldview: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  background: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  with: {
    fontFamily: "Pixeled",
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 10,

  }
});

export default Home;
