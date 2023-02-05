import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { Easing } from "$/types";

interface AnimatedMounterColumnProps {
  Module: any;
  children: ReactNode;
  show: boolean;
  keyForElement: string;
  animationDuration: number;
  easing: Easing;
}

export default function ({
  Module,
  children,
  show,
  keyForElement,
  animationDuration,
  easing,
}: AnimatedMounterColumnProps) {
  const {
    View: AnimatedView,
    Easing,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
  } = Module;

  const flex = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return show;
    },
    (showResult: boolean) => {
      if (showResult) {
        flex.value = 1;
      } else {
        flex.value = 0;
      }
    },
    [show]
  );

  const styleRNA = useAnimatedStyle(() => {
    return {
      flex: withTiming
        ? withTiming(flex.value, {
            duration: animationDuration,
            easing: Easing[easing],
          })
        : 0,
      width: flex.value === 0 ? 0 : undefined,
    };
  }, [show]);

  if (!AnimatedView) {
    return (
      <View>
        <Text>trying to load reanimated...</Text>
      </View>
    );
  }

  return (
    <AnimatedView style={styleRNA} key={keyForElement}>
      {children}
    </AnimatedView>
  );
}
