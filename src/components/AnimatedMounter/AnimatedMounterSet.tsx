import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { Box } from "$/components/Box";
import AnimatedMounterColumnReanminated from "$/components/AnimatedMounter/AnimatedMounterColumnReanimated";
import AnimatedMounterColumnSpring from "$/components/AnimatedMounter/AnimatedMounterColumnSpring";
import { MountingErrorDisplay } from "$/components/AnimatedMounter/MountingErrorDisplay";
import { sleep } from "$/utils/sleep";
import { Easing, Lib } from "$/types";

interface AnimatedMounterSetProps<P> {
  lib: Lib;
  AnimationModule: any;
  set: JSX.Element[];
  keyForElemFn: (child: JSX.Element) => string;
  styleFn?: (child: JSX.Element) => object;
  ComponentToMount: (child: JSX.Element) => ReactNode;
  animationDuration: number;
  easing: Easing;
  useHorizontalCurtains: boolean;
}

export const AnimatedMounterSet = <P extends unknown>({
  lib,
  AnimationModule,
  set,
  keyForElemFn,
  styleFn,
  ComponentToMount,
  animationDuration,
  easing,
  useHorizontalCurtains,
}: AnimatedMounterSetProps<P>) => {
  const [keys, setKeys] = useState<string[]>(set.map((c) => c.key as string));
  const [prevCopy, setPrevCopy] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newKeys = set.map((c) => c.key as string);
    if (newKeys !== keys) {
      setKeys(newKeys);
    }
  }, [set]);

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
  }, [keys]);

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

  if (lib === "spring" && AnimationModule.error) {
    return <MountingErrorDisplay lib={"spring"} />;
  } else if (lib === "reanimated" && AnimationModule.error) {
    return <MountingErrorDisplay lib={"reanimated"} />;
  }

  return (
    <Box
      style={{
        flex: 1,
        flexDirection: useHorizontalCurtains ? "column" : "row",
      }}
    >
      {elementsToRender.map((elem: JSX.Element) => {
        const columnProps = {
          key: keyForElemFn(elem),
          keyForElement: keyForElemFn(elem),
          show: !elementsToHide?.includes(elem) || false,
          length: nrOfElementsToRender,
          style: styleFn ? styleFn(elem) : {},
          animationDuration: animationDuration,
          easing,
          useHorizontalCurtains,
        };
        return lib === "reanimated" ? (
          <AnimatedMounterColumnReanminated
            {...columnProps}
            AnimationModule={AnimationModule}
          >
            {ComponentToMount(elem)}
          </AnimatedMounterColumnReanminated>
        ) : (
          <AnimatedMounterColumnSpring
            {...columnProps}
            AnimationModule={AnimationModule}
          >
            {ComponentToMount(elem)}
          </AnimatedMounterColumnSpring>
        );
      })}
    </Box>
  );
};
