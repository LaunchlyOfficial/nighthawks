import { type TargetAndTransition } from "framer-motion";

export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
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

// Add fadeInVariants as an alias for backward compatibility
export const fadeInVariants = fadeIn;