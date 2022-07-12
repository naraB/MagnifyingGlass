import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import React, { useCallback } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureState } from "../types";
import { DockItem } from "./DockItem";

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    zIndex: 2,
    // alignSelf: "center",
  },
  container: {
    marginHorizontal: 8,
  },
  dock: {
    marginHorizontal: 8,
    // backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
const SCREEN_DIMENSIONS = Dimensions.get("screen");
const ContainerWidth = SCREEN_DIMENSIONS.width - 16;

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const icons = [
  require("../assets/finder.png"),
  require("../assets/messages.png"),
  require("../assets/photos.png"),
  require("../assets/safari.png"),
  require("../assets/maps.png"),
  require("../assets/craft.png"),
  require("../assets/things.png"),
  require("../assets/1password.png"),

  require("../assets/figma.png"),
];

export function Dock() {
  const { bottom } = useSafeAreaInsets();
  const dragX = useSharedValue(0);
  const gestureState = useSharedValue<GestureState>(GestureState.Idle);

  const handleGestureEvent = useAnimatedGestureHandler({
    onStart: ({ x }) => {
      gestureState.value = GestureState.Started;
      dragX.value = x;
    },
    onActive: ({ x }) => {
      gestureState.value = GestureState.Active;
      dragX.value = x;
    },
    onEnd: () => {
      gestureState.value = GestureState.Idle;
      dragX.value = 0;
    },
    onFinish: () => {
      gestureState.value = GestureState.Idle;
      dragX.value = 0;
    },
  });

  const activeIndex = useDerivedValue(() => {
    // 32 + 6 (horizontal margin)
    const itemWidth = 38;
    const val = dragX.value;
    // itemWidth + 16 (padding)
    if (val > 0 && val <= 54) {
      return 0;
    }
    if (val > 54 && val <= 92) {
      return 1;
    }
    if (val > 92 && val <= 130) {
      return 2;
    }
    if (val > 130 && val <= 168) {
      return 3;
    }
    if (val > 168 && val <= 206) {
      return 4;
    }
    if (val > 206 && val <= 244) {
      return 5;
    }
    if (val > 244 && val <= 282) {
      return 6;
    }
    if (val > 282 && val <= 320) {
      return 7;
    }
    if (val > 320 && val <= ContainerWidth) {
      return 8;
    }
  });

  return (
    <View style={[styles.wrapper, { bottom: bottom || 16 }]}>
      <PanGestureHandler
        maxPointers={1}
        minDist={1}
        onGestureEvent={handleGestureEvent}
      >
        <Animated.View>
          <SquircleView
            style={[styles.dock]}
            squircleParams={{
              cornerRadius: 19.64,
              cornerSmoothing: 0.6,
              fillColor: "#222", //rgba(0,0,0,0.4)",
            }}
          >
            {icons.map((e, index) => (
              <DockItem
                index={index}
                iconFilename={e}
                gestureState={gestureState}
                dragX={dragX}
                key={e}
                last={items.length - 1}
                activeIndex={activeIndex}
              />
            ))}
          </SquircleView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
