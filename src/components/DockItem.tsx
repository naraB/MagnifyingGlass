import React, { useCallback } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  WithSpringConfig,
  withTiming,
} from "react-native-reanimated";
import { GestureState } from "../types";

const Radius = 150;
const ScaleUpFactor = 2;
const ScaleDownFactor = 0.5;

const MarginHorizontal = 3;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 3,
  },
  box: {
    // backgroundColor: "#ddd",
    // marginHorizontal: 3,
    borderRadius: 8,
    height: 32,
    width: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

type Props = {
  dragX: SharedValue<number>;
  gestureState: SharedValue<GestureState>;
  index: number;
  last: number;
  activeIndex: SharedValue<number>;
  iconFilename: string;
};

const SpringConfig: WithSpringConfig = {
  damping: 40,
  mass: 1,
  stiffness: 600,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

const getTranslateX = (
  activeIndex: number,
  index: number,
  last: number
): number => {
  "worklet";
  if (activeIndex === index || index === 0 || index === last) {
    return 0;
  }
  const sign = activeIndex > index ? -1 : 1;
  const offset = sign * 16;
  return index === 1 || index === last - 1 ? offset : offset;
};

const Timing = {
  duration: 125,
  easing: Easing.linear,
};

export function DockItem({
  dragX,
  gestureState,
  index,
  last,
  activeIndex,
  iconFilename,
}: Props) {
  const x = useSharedValue(-1);
  const translateX = useSharedValue(0);
  const filepath = `../assets/${iconFilename}`;
  console.log(filepath);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const startX = event.nativeEvent.layout.x;
    const width = event.nativeEvent.layout.width;
    x.value = startX + width / 2;
  }, []);

  const scaleFactor = useDerivedValue(() => {
    if (gestureState.value === GestureState.Idle) {
      translateX.value = withTiming(0, Timing);
      return withTiming(1, Timing);
    }
    const interpolation = interpolate(
      Math.abs(dragX.value - x.value),
      [0, Radius],
      [ScaleUpFactor, ScaleDownFactor],
      Extrapolate.CLAMP
    );
    if (gestureState.value === GestureState.Started) {
      return withTiming(interpolation, Timing);
    }
    if (gestureState.value === GestureState.Active) {
      return interpolation;
    }
  });

  const animatedStyles = useAnimatedStyle(
    () => ({
      marginHorizontal: interpolate(
        scaleFactor.value,
        [ScaleUpFactor, 1],
        [16, 0],
        Extrapolate.EXTEND
      ),
      transform: [
        {
          scale: scaleFactor.value,
        },
        {
          translateY: interpolate(
            scaleFactor.value,
            [ScaleUpFactor - 0.5, 1],
            [-12, 0],
            Extrapolate.CLAMP
          ),
        },
        // {
        //   translateX: translateX.value,
        // },
      ],
    }),
    []
  );

  return (
    <Animated.View onLayout={onLayout} style={[animatedStyles]}>
      <Image source={iconFilename as any} style={styles.box} />
    </Animated.View>
  );
}
