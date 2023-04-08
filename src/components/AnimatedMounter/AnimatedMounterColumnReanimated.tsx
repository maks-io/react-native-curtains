import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { Easing } from "$/types";

interface AnimatedMounterColumnProps {
  AnimationModule: any;
  children: ReactNode;
  show: boolean;
  keyForElement: string;
  animationDuration: number;
  easing: Easing;
}

export default function ({
  AnimationModule,
  children,
  show,
  keyForElement,
  animationDuration,
  easing,
}: AnimatedMounterColumnProps) {
  const {
    Easing,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
  } = AnimationModule;
  const AnimatedView = AnimationModule.default.View;

  const flex = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const hideOverflow = useSharedValue(true);

  useAnimatedReaction(
    () => {
      return show;
    },
    (showResult: boolean) => {
      if (showResult) {
        flex.value = 1;
        hideOverflow.value = true;
      } else {
        flex.value = 0;
        hideOverflow.value = true;
      }
    },
    [show]
  );

  const styleRNA = useAnimatedStyle(() => {
    return {
      flex: withTiming
        ? withTiming(
            flex.value,
            {
              duration: animationDuration,
              easing: Easing[easing],
            },
            (isFinished: boolean) => {
              if (isFinished) {
                hideOverflow.value = false;
              }
            }
          )
        : 0,
      width: flex.value === 0 ? 0 : undefined,
      zIndex: zIndex.value,
      overflow: hideOverflow.value === true ? "hidden" : "visible",
    };
  }, [show]);

  if (!AnimatedView) {
    return (
      <View>
        <Text>trying to load reanimated...</Text>
      </View>
    );
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement<any>(child, { zIndex });
    }
    return child;
  });

  return (
    <AnimatedView style={styleRNA} key={keyForElement}>
      {childrenWithProps}
    </AnimatedView>
  );
}
