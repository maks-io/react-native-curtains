import React, { ReactNode } from "react";
import { Text, View } from "react-native";

interface AnimatedMounterColumnProps {
  AnimationModule: any;
  children: ReactNode;
  show: boolean;
  keyForElement: string;
  style: object;
  animationDuration: number;
}

export default function ({
  AnimationModule,
  children,
  show,
  keyForElement,
  style,
  animationDuration,
}: AnimatedMounterColumnProps) {
  const { useTransition, animated } = AnimationModule;

  const transitions = useTransition(show, {
    from: { flex: 0, scale: 0 },
    enter: { flex: 1, scale: 1 },
    leave: { flex: 0, scale: 0 },
    reverse: show,
    config: {
      duration: animationDuration,
    },
  });

  if (!AnimationModule?.animated) {
    return (
      <View>
        <Text>trying to load spring...</Text>
      </View>
    );
  }

  return transitions(
    (styles: any, item: any) =>
      item && (
        <animated.View
          key={keyForElement}
          style={{
            flex: styles.flex,
            position: "relative",
            overflow: "hidden",
            ...style,
          }}
        >
          {children}
        </animated.View>
      )
  );
}
