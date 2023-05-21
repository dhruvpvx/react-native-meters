import React from 'react';
import { Svg, Circle, Line, G, Text } from 'react-native-svg';
import { polar2Canvas } from 'react-native-redash';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue } from 'react-native-reanimated';

import { Dimensions, StyleSheet, View } from 'react-native';
import { Colors } from '../res';

const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Dimensions.get('window').height;

const normalise = (value) => {
  return 0.0028 * deviceWidth * value;
};

const WIDTH = normalise(573);

const RADIUS = WIDTH / 2;

const CIRCLY = normalise(10);

const CX = deviceWidth / 2;

const CY = RADIUS + CIRCLY;

const { PI } = Math;

const TAU = 2 * PI;

const LINES = 300;

const DELTA = TAU / LINES;

const LINE_PADDING = 3;

const CENTER = { x: CX, y: CY };

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const AnimatedG = Animated.createAnimatedComponent(G);

const WeightMeter = () => {
  const roate = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startEvent = event;
    },
    onActive: (event, ctx) => {
      const { translationX, translationY } = event;
      const { startEvent } = ctx;
      const dx = translationX - startEvent.translationX;
      const dy = translationY - startEvent.translationY;
      const theta = Math.atan2(dy, dx);
      roate.value = roate.value + theta;
    },
    onEnd: ({ translationX, translationY }, ctx) => {},
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <AnimatedSvg width={deviceWidth} height={WIDTH}>
            <AnimatedG transform={`rotate(${roate.value} ${CX} ${CY})`}>
              <AnimatedCircle cx={CX} cy={CY} r={RADIUS} fill="none" stroke={Colors.GREY_E4} strokeWidth={11} />
              {new Array(LINES).fill(0).map((_, i) => {
                const index = LINES - i;
                const theta = i * DELTA;
                const LINE_RADIUS = RADIUS / 1.1;
                const p1 = polar2Canvas(
                  {
                    theta,
                    radius: LINE_RADIUS,
                  },
                  CENTER
                );

                const isTenth = i % 10 === 0;
                const isFifth = i % 5 === 0;

                const smallRadius = LINE_RADIUS - LINE_PADDING * 9;

                const p2 = polar2Canvas(
                  {
                    theta,
                    radius: isTenth
                      ? smallRadius - LINE_PADDING * 10
                      : isFifth
                      ? smallRadius - LINE_PADDING * 5
                      : smallRadius,
                  },
                  CENTER
                );

                const strokeWidth = isTenth ? 1.5 : isFifth ? 0.75 : 0.5;
                const stroke = isFifth ? Colors.PEACH : Colors.BLACK;

                const textX = p2.x;
                const textY = p2.y;

                const dx = textX - CX;
                const dy = textY - CY;
                const angle = Math.atan2(dy, dx);
                const angleInDegrees = (angle * 180) / Math.PI;
                const normalizedAngle = angleInDegrees >= 0 ? angleInDegrees : angleInDegrees + 360;
                const rotate = normalizedAngle.toString();

                return (
                  <G key={i}>
                    <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={stroke} strokeWidth={strokeWidth} />
                    {isTenth && (
                      <Text
                        x={textX}
                        y={textY}
                        transform={`rotate(${rotate}, ${textX}, ${textY})`}
                        fill={Colors.BLACK}
                        fontSize={10}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        dy={normalise(10)}
                      >
                        {index}
                      </Text>
                    )}
                  </G>
                );
              })}
            </AnimatedG>
          </AnimatedSvg>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

export default WeightMeter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: normalise(180),
  },
});
