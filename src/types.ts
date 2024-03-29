export type Lib = "reanimated" | "spring";

export type Easing =
  | "linear"
  | "ease"
  | "quad"
  | "cubic"
  | "sin"
  | "circle"
  | "exp"
  | "bounce";

interface ReactNativeCurtainsBaseProps {
  lib: Lib;
  AnimationModule: any;
  children: JSX.Element[];
  animationDuration?: number;
  useHorizontalCurtains?: boolean;
}

interface ReactNativeCurtainsWithReanimatedProps
  extends ReactNativeCurtainsBaseProps {
  lib: "reanimated";
  easing?: Easing;
}

interface ReactNativeCurtainsWithSpringProps
  extends ReactNativeCurtainsBaseProps {
  lib: "spring";
  easing?: never;
}

export type ReactNativeCurtainsProps =
  | ReactNativeCurtainsWithReanimatedProps
  | ReactNativeCurtainsWithSpringProps;
