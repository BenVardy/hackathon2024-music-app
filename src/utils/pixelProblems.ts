import {PixelRatio} from 'react-native';

/**
 * Convert physical pixels to logical pixels.
 *
 * @param n The physical pixel value to convert.
 * @returns Logical pixel value.
 */
export function phyToLogPx(n: number): number {
  return n / PixelRatio.get();
}
