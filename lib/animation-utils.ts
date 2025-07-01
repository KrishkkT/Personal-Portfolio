// Animation utility functions using pure CSS and Framer Motion
export class AnimationUtils {
  // Fade in animation
  static fadeIn(duration = 0.5) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration },
    }
  }

  // Slide up animation
  static slideUp(duration = 0.5, distance = 50) {
    return {
      initial: { opacity: 0, y: distance },
      animate: { opacity: 1, y: 0 },
      transition: { duration },
    }
  }

  // Slide down animation
  static slideDown(duration = 0.5, distance = 50) {
    return {
      initial: { opacity: 0, y: -distance },
      animate: { opacity: 1, y: 0 },
      transition: { duration },
    }
  }

  // Slide left animation
  static slideLeft(duration = 0.5, distance = 50) {
    return {
      initial: { opacity: 0, x: distance },
      animate: { opacity: 1, x: 0 },
      transition: { duration },
    }
  }

  // Slide right animation
  static slideRight(duration = 0.5, distance = 50) {
    return {
      initial: { opacity: 0, x: -distance },
      animate: { opacity: 1, x: 0 },
      transition: { duration },
    }
  }

  // Scale animation
  static scale(duration = 0.5, scale = 0.8) {
    return {
      initial: { opacity: 0, scale },
      animate: { opacity: 1, scale: 1 },
      transition: { duration },
    }
  }

  // Stagger children animation
  static staggerChildren(staggerDelay = 0.1) {
    return {
      animate: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }
  }

  // Bounce animation
  static bounce(duration = 0.6) {
    return {
      initial: { opacity: 0, y: -50 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 100,
          duration,
        },
      },
    }
  }

  // Rotate animation
  static rotate(duration = 0.5, rotation = 180) {
    return {
      initial: { opacity: 0, rotate: rotation },
      animate: { opacity: 1, rotate: 0 },
      transition: { duration },
    }
  }

  // Flip animation
  static flip(duration = 0.6) {
    return {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
      transition: { duration },
    }
  }

  // Pulse animation
  static pulse(duration = 1) {
    return {
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    }
  }

  // Float animation
  static float(duration = 2) {
    return {
      animate: {
        y: [0, -10, 0],
        transition: {
          duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    }
  }

  // Typewriter effect
  static typewriter(text: string, duration = 2) {
    return {
      initial: { width: 0 },
      animate: { width: "auto" },
      transition: {
        duration,
        ease: "linear",
      },
    }
  }

  // Gradient shift animation
  static gradientShift(duration = 3) {
    return {
      animate: {
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        transition: {
          duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      },
    }
  }

  // Shake animation
  static shake(duration = 0.5) {
    return {
      animate: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration },
      },
    }
  }

  // Zoom in animation
  static zoomIn(duration = 0.5) {
    return {
      initial: { opacity: 0, scale: 0 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration },
    }
  }

  // Zoom out animation
  static zoomOut(duration = 0.5) {
    return {
      initial: { opacity: 0, scale: 1.2 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration },
    }
  }
}

// Export default for backward compatibility
export default AnimationUtils
