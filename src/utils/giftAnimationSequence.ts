
import { Variants } from "framer-motion";

export interface GiftAnimationProps {
  amount: string;
  messageVideo: File | null;
  memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>;
}

export const giftContainerVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.3
    }
  }
};

export const messageVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
};

export const memoriesVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: custom * 0.2,
      duration: 0.3
    }
  })
};

export const amountVariants: Variants = {
  hidden: {
    scale: 0.5,
    opacity: 0,
    y: 20
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

export const confettiVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0
  },
  visible: {
    opacity: [0, 1, 0],
    scale: [0, 1.2, 1],
    transition: {
      duration: 0.8,
      times: [0, 0.5, 1]
    }
  }
};
