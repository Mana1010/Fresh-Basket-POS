import { type Variants } from "framer-motion";

export const roleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    y: 10,
    opacity: 0,
  },
};
