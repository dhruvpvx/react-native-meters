import {View, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {Circle, G, Path, Svg} from 'react-native-svg';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {ReText} from 'react-native-redash';
import {BAR_SPACE, INITAL_X, SVG_HEIGHT, SVG_WIDTH} from './constants';
import ScaleBar from './ScaleBar';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface MeasureScaleProps {
  points: number;
  devideBy: number;
  active: number;
  onChange: (value: number) => void;
}

const MeasureScale = ({
  points,
  devideBy = 1,
  active,
  ...props
}: MeasureScaleProps) => {
  const [value, setValue] = React.useState(0);
  const taransX = useSharedValue(0);
  const activeValue = useSharedValue<string>('0');
  const lastBarX = points * BAR_SPACE + 10;
  const barPoints = useMemo(() => {
    return Array.from({length: points});
  }, [points]);

  useEffect(() => {
    props.onChange && props.onChange(value);
  }, [props, value]);

  React.useEffect(() => {
    const newX = -Math.round(active * devideBy * BAR_SPACE);
    const forActive = active.toString();
    activeValue.value = forActive;
    taransX.value = withSpring(newX);
  }, [activeValue, active, devideBy, taransX]);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {startX: number}
  >(
    {
      onStart: (event, ctx) => {
        ctx.startX = taransX.value;
      },
      onActive: (event, ctx) => {
        let newX = ctx.startX + event.translationX;
        if (newX > lastBarX) {
          newX = lastBarX;
        } else if (newX >= 0) {
          newX = 0;
        }
        const newCurrentValue = Math.round(-newX / BAR_SPACE);
        activeValue.value = (newCurrentValue / devideBy).toString();
        taransX.value = newX;
      },
      onEnd: () => {
        const destination = Math.round(taransX.value / BAR_SPACE) * BAR_SPACE;
        const newCurrentValue = Math.round(-destination / BAR_SPACE);
        activeValue.value = (newCurrentValue / devideBy).toString();
        runOnJS(setValue)(newCurrentValue);
        taransX.value = withSpring(destination);
      },
    },
    [],
  );

  const renderScaleBar = useCallback(
    (_: unknown, i: number) => {
      return (
        <ScaleBar
          i={i}
          key={i.toString()}
          taransX={taransX}
          devideBy={devideBy}
        />
      );
    },
    [taransX, devideBy],
  );

  return (
    <View style={styles.container}>
      <View style={styles.indicator}>
        <ReText text={activeValue} style={styles.activeValue} />
      </View>
      <GestureHandlerRootView style={styles.container}>
        <PanGestureHandler
          activeOffsetX={[0, 0]}
          onGestureEvent={onGestureEvent}>
          <AnimatedSvg width={SVG_WIDTH} height={SVG_HEIGHT}>
            {barPoints.map(renderScaleBar)}
            <G x={INITAL_X - BAR_SPACE} y={SVG_HEIGHT / 6}>
              <Path
                d={`M${9.613} ${100.5}V0`}
                stroke={'#EA6F54'}
                strokeWidth={1.5}
              />
              <Circle
                cx={9.61844}
                cy={20.9384}
                r={2.22744}
                transform="rotate(90 9.618 20.938)"
                fill={'#EA6F54'}
              />
              <Circle
                cx={10.0639}
                cy={99.7895}
                r={3.56391}
                transform="rotate(90 10.064 99.79)"
                fill={'#EA6F54'}
              />
            </G>
          </AnimatedSvg>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
};

export default React.memo(MeasureScale);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  activeValue: {
    // ...Fonts.medium(12, '#EA6F54'),
    textAlign: 'center',
  },
  indicator: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
});
