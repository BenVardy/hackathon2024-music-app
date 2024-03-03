import {PixelRatio} from 'react-native';

export function phyToLogPx(n: number): number {
  return n / PixelRatio.get();
}
