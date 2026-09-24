"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useReducedMotion } from "motion/react";

export function CycleRouteAnimation() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto aspect-square w-full max-w-[360px]" role="img" aria-label="Animated cyclist following a winding route">
      <DotLottieReact
        src="/cycle-route.lottie"
        autoplay={!reduceMotion}
        loop={!reduceMotion}
        className="h-full w-full"
      />
    </div>
  );
}
