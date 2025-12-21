// Animation Utilities
import { Variants } from 'framer-motion';

/**
 * Fade in animation variants
 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

/**
 * Slide in from bottom
 */
export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

/**
 * Slide in from right
 */
export const slideRight: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

/**
 * Scale in animation
 */
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

/**
 * Default transition
 */
export const defaultTransition = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
};

