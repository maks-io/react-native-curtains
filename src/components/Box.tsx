import React, { PropsWithChildren } from "react";
import { LayoutChangeEvent, View } from "react-native";

export interface BoxProps {
  color?: string;
  style?: object;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const Box = ({
  children,
  color,
  style = {},
  onLayout = () => {},
}: PropsWithChildren<BoxProps>): JSX.Element => {
  return (
    <View
      onLayout={onLayout}
      style={{
        ...style,
        position: "relative",
        borderColor: color,
        borderStyle: color ? "solid" : undefined,
        borderWidth: color ? 3 : undefined,
        backgroundColor: color,
      }}
    >
      {color && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.65,
            backgroundColor: "white",
          }}
        />
      )}
      {children}
    </View>
  );
};
