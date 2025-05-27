import type { Variants } from "framer-motion";

export const sidebarVariants: Variants = {
  hidden: {
    x: -80,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

export const textVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const selectBoxVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const addCategoryModalVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};
