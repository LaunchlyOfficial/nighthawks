import { type TargetAndTransition, type Variant } from "framer-motion";

export const fadeIn: TargetAndTransition = {
  opacity: 1,
  y: 0,
  transition: { duration: 0.5 }
};

export const fadeInVariants: Record<string, Variant> = {
  hidden: { opacity: 0, y: 20 },
  visible: fadeIn
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const matrixBg: TargetAndTransition = {
  backgroundPosition: ["0% 0%", "100% 100%"],
  transition: {
    duration: 20,
    ease: "linear",
    repeat: Infinity
  }
};

export const gradientAnimation = {
  background: [
    "linear-gradient(45deg, #000000, #FF0080, #000000)",
    "linear-gradient(45deg, #000000, #7000FF, #000000)",
    "linear-gradient(45deg, #FF0080, #000000, #7000FF)",
    "linear-gradient(45deg, #000000, #FF0080, #000000)"
  ],
  transition: {
    duration: 10,
    repeat: Infinity,
    ease: "linear"
  }
};