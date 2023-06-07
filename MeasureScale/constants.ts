import {Dimensions} from 'react-native';

const deviceWidth = Dimensions.get('window').width;

const normliseValue = (value: number) => {
  return 0.0028 * deviceWidth * value;
};

export const SVG_WIDTH = normliseValue(209);
export const SVG_HEIGHT = normliseValue(121);

export const INITAL_X = SVG_WIDTH / 2;

export const BAR_SPACE = 5.5;
