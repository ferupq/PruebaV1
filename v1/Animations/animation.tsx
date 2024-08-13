"use client";

import { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

// animations.ts
export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

// animations.ts
export const fadeOutBlur: Variants = {
  initial: { opacity: 1, filter: "blur(0px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(10px)" },
};

// animations.ts
export const rotateIn: Variants = {
  initial: { opacity: 0, rotate: -30 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 30 },
};

// animations.ts
export const bounceIn: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
  exit: { opacity: 0, y: 30 },
};

// animations.ts
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};
