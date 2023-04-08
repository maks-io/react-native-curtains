import React from "react";
import { AnimatedMounterSet } from "$/components/AnimatedMounter/AnimatedMounterSet";
import { Box } from "$/components/Box";
import { ReactNativeCurtainsProps } from "$/types";

export const ReactNativeCurtains = <T extends unknown>({
  lib,
  AnimationModule,
  children,
  animationDuration = 500,
  easing = "linear",
}: ReactNativeCurtainsProps): JSX.Element => {
  return (
    <Box style={{ flex: 1 }}>
      <AnimatedMounterSet<T>
        lib={lib}
        AnimationModule={AnimationModule}
        set={children}
        keyForElemFn={(child: JSX.Element) => `column-${child.key}`}
        ComponentToMount={(child: JSX.Element) => child}
        animationDuration={animationDuration}
        easing={easing}
      />
    </Box>
  );
};
