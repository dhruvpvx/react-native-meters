import React from 'react';
import {G, Line, Text} from 'react-native-svg';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {BAR_SPACE, INITAL_X, SVG_HEIGHT} from './constants';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface ScaleBarProps {
  taransX: Animated.SharedValue<number>;
  devideBy?: number;
  i: number;
}

const ScaleBar = ({taransX, i, devideBy}: ScaleBarProps) => {
  const isTenth = i % 10 === 0;
  const isFifth = i % 5 === 0 && !isTenth;
  const y1 = isTenth
    ? SVG_HEIGHT * 0.4948
    : isFifth
    ? SVG_HEIGHT * 0.5832
    : SVG_HEIGHT * 0.65;
  const x1 = i * BAR_SPACE + 10;
  const x2 = i * BAR_SPACE + 10;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: taransX.value}],
    };
  });

  return (
    <AnimatedG x={INITAL_X - BAR_SPACE} style={animatedStyle}>
      <AnimatedLine
        x1={x1}
        y1={y1}
        x2={x2}
        y2={SVG_HEIGHT / 1.2}
        stroke={isFifth ? '#EA6F54' : 'black'}
        opacity={isTenth || isFifth ? 1 : 0.2}
        strokeWidth={1.2}
      />
      {isTenth && (
        <AnimatedText
          x={x1}
          y={y1 - 5}
          fill={'black'}
          // {...Fonts.regular(12, Colors.BLACK)}
          textAnchor="middle">
          {i / (devideBy || 0)}
        </AnimatedText>
      )}
    </AnimatedG>
  );
};

export default React.memo(ScaleBar, (prev, next) => {
  return prev.i === next.i;
});
