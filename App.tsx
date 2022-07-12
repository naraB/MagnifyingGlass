import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Dock } from "./src/components/Dock";

const SCREEN_DIMENSIONS = Dimensions.get("screen");

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* <Image
          source={require("./src/assets/ef7jfe3c0z851.jpeg")}
          style={{
            width: SCREEN_DIMENSIONS.width,
            height: SCREEN_DIMENSIONS.height,
          }}
        /> */}
        <View style={styles.container} />
        <Dock />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
