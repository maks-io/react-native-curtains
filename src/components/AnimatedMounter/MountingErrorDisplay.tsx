import React from "react";
import { Text, View } from "react-native";
import { Box } from "$/components/Box";
import { Lib } from "$/types";

interface MountingErrorDisplayProps {
  lib: Lib;
}

const libNameMapping: { [lib in Lib]: string } = {
  reanimated: "react-native-reanimated",
  spring: "@react-spring/native",
};
export const MountingErrorDisplay = ({
  lib,
}: MountingErrorDisplayProps): JSX.Element => {
  const reactNativeCurtains = "react-native-curtains";
  const libName = libNameMapping[lib];
  const alternativeLib: Lib = lib === "reanimated" ? "spring" : "reanimated";
  const alternativeLibName = libNameMapping[alternativeLib];

  return (
    <Box
      color={"#b74444"}
      style={{
        flex: 1,
      }}
    >
      <View style={{ margin: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 42, marginTop: 20 }}>:(</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          {reactNativeCurtains} error
        </Text>
        <Text style={{ marginTop: 20 }}>
          Could not load <Text style={{ fontWeight: "bold" }}>{libName}</Text>.
        </Text>
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          Make sure to properly install and setup{"\n"}
          <Text style={{ fontWeight: "bold" }}>{libName}</Text>
          {"\n"}if you use{" "}
          <Text style={{ fontWeight: "bold" }}>{reactNativeCurtains}</Text>
          {"\n"}with{" "}
          <Text style={{ fontWeight: "bold", backgroundColor: "#dcdcdc" }}>
            lib=&#123;"{lib}"&#125;
          </Text>
          .
        </Text>
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          Alternatively you could also use{"\n"}
          <Text style={{ fontWeight: "bold" }}>{alternativeLibName}</Text>
          {"\n"}
          instead, by passing{"\n"}
          <Text style={{ fontWeight: "bold", backgroundColor: "#dcdcdc" }}>
            lib=&#123;"{alternativeLib}"&#125;
          </Text>
          .
        </Text>
      </View>
    </Box>
  );
};
