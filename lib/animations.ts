// Animation manager for handling complex animations
export class AnimationManager {
  private static instance: AnimationManager
  private animations: Map<string, any> = new Map()

  private constructor() {}

  public static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager()
    }
    return AnimationManager.instance
  }

  // Register an animation
  public registerAnimation(name: string, animation: any): void {
    this.animations.set(name, animation)
  }

  // Get an animation by name
  public getAnimation(name: string): any {
    return this.animations.get(name)
  }

  // Remove an animation
  public removeAnimation(name: string): boolean {
    return this.animations.delete(name)
  }

  // Clear all animations
  public clearAnimations(): void {
    this.animations.clear()
  }

  // Get all animation names
  public getAnimationNames(): string[] {
    return Array.from(this.animations.keys())
  }

  // Check if animation exists
  public hasAnimation(name: string): boolean {
    return this.animations.has(name)
  }
}

// Common animation presets
export const animationPresets = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },

  // Modal animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 },
    transition: { duration: 0.3 },
  },

  // Button hover effects
  buttonHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 },
  },

  // Card animations
  cardHover: {
    whileHover: {
      y: -5,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    },
    transition: { duration: 0.3 },
  },

  // Loading animations
  spinner: {
    animate: { rotate: 360 },
    transition: {
      duration: 1,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    },
  },

  // Text animations
  textReveal: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },

  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 },
  },

  // Image animations
  imageLoad: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
}

// Animation timing functions
export const easingFunctions = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
}

// Export default animation manager instance
export default AnimationManager.getInstance()
