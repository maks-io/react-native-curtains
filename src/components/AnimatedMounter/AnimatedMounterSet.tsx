import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Box } from "$/components/Box";
import AnimatedMounterColumnReanminated from "$/components/AnimatedMounter/AnimatedMounterColumnReanimated";
import AnimatedMounterColumnSpring from "$/components/AnimatedMounter/AnimatedMounterColumnSpring";
import { MountingErrorDisplay } from "$/components/AnimatedMounter/MountingErrorDisplay";
import { sleep } from "$/utils/sleep";
import { Easing, Lib } from "$/types";

interface AnimatedMounterSetProps<P> {
  lib: Lib;
  set: JSX.Element[];
  keyForElemFn: (child: JSX.Element) => string;
  styleFn?: (child: JSX.Element) => object;
  ComponentToMount: (child: JSX.Element) => ReactNode;
  animationDuration: number;
  easing: Easing;
}

export const AnimatedMounterSet = <P extends unknown>({
  lib,
  set,
  keyForElemFn,
  styleFn,
  ComponentToMount,
  animationDuration,
  easing,
}: AnimatedMounterSetProps<P>) => {
  const [prevCopy, setPrevCopy] = useState<JSX.Element[]>([]);
  const [SpringModule, setSpringModule] = useState<{
    useTransition: any;
    animated: any;
    error?: true;
  }>({
    useTransition: () => {},
    animated: null,
  });
  const [ReanimatedModule, setReanimatedModule] = useState<{
    View: any;
    Easing: any;
    useAnimatedReaction: any;
    useAnimatedStyle: any;
    useSharedValue: any;
    withTiming: any;
    error?: true;
  }>({
    View,
    Easing: {},
    useAnimatedReaction: () => {},
    useAnimatedStyle: () => {},
    useSharedValue: () => ({ value: 1 }),
    withTiming: null,
  });

  useEffect(() => {
    const initSpringModule = async () => {
      try {
        const module = await import("@react-spring/native");
        setSpringModule(module);
      } catch (e) {
        setSpringModule((prevState) => ({ ...prevState, error: true }));
      }
    };
    const initReanimatedModule = async () => {
      try {
        const module = await import("react-native-reanimated");
        setReanimatedModule({ ...module, View: module.default.View });
      } catch (e) {
        setReanimatedModule((prevState) => ({ ...prevState, error: true }));
        // do nothing
      }
    };

    initSpringModule();
    initReanimatedModule();
  }, []);

  useEffect(() => {
    const updatePrevCopy = async () => {
      if (prevCopy.length === 0) {
        setPrevCopy(set);
      } else {
        await sleep(animationDuration);
        setPrevCopy(set);
      }
    };
    updatePrevCopy();
  }, [set]);

  const elementsToHide = useMemo(
    () =>
      prevCopy
        ? prevCopy?.filter(
            (prevElem) => !set?.map((c) => c.key).includes(prevElem.key)
          )
        : [],
    [prevCopy, set]
  );

  const elementsToRender = useMemo(
    () => (set.length >= prevCopy.length ? set : prevCopy),
    [set, prevCopy]
  );

  const nrOfElementsToRender = elementsToRender.length;

  if (lib === "spring" && SpringModule.error) {
    return <MountingErrorDisplay lib={"spring"} />;
  } else if (lib === "reanimated" && ReanimatedModule.error) {
    return <MountingErrorDisplay lib={"reanimated"} />;
  }

  return (
    <Box style={{ flex: 1, flexDirection: "row" }}>
      {elementsToRender.map((elem: JSX.Element) => {
        const columnProps = {
          key: keyForElemFn(elem),
          keyForElement: keyForElemFn(elem),
          show: !elementsToHide?.includes(elem) || false,
          length: nrOfElementsToRender,
          style: styleFn ? styleFn(elem) : {},
          animationDuration: animationDuration,
          easing,
        };
        return lib === "reanimated" ? (
          <AnimatedMounterColumnReanminated
            {...columnProps}
            Module={ReanimatedModule}
          >
            {ComponentToMount(elem)}
          </AnimatedMounterColumnReanminated>
        ) : (
          <AnimatedMounterColumnSpring {...columnProps} Module={SpringModule}>
            {ComponentToMount(elem)}
          </AnimatedMounterColumnSpring>
        );
      })}
    </Box>
  );
};
