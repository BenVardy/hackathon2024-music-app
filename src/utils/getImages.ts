import {ImageSourcePropType} from 'react-native';

export function getImages(): {[key: string]: ImageSourcePropType} {
  return {
    gamer: require('../../assets/images/gamer.png'),
    puzzle: require('../../assets/images/puzzle.png'),
    headphones: require('../../assets/images/headphones.png'),
    idea: require('../../assets/images/idea.png'),
    coffee: require('../../assets/images/coffee.png'),
    eightBit: require('../../assets/images/eightball.png'),
    star: require('../../assets/images/star.png'),
    bubble: require('../../assets/images/text.png'),
  };
}
