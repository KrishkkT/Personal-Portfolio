// Simple animation manager
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

  public registerAnimation(name: string, animation: any): void {
    this.animations.set(name, animation)
  }

  public getAnimation(name: string): any {
    return this.animations.get(name)
  }

  public removeAnimation(name: string): boolean {
    return this.animations.delete(name)
  }

  public clearAnimations(): void {
    this.animations.clear()
  }
}

// Simple animation presets
export const animationPresets = {
  fadeIn: {
    opacity: 0,
    transition: "opacity 0.5s ease-in-out",
  },
  slideUp: {
    opacity: 0,
    transform: "translateY(30px)",
    transition: "all 0.5s ease-out",
  },
  scale: {
    opacity: 0,
    transform: "scale(0.8)",
    transition: "all 0.5s ease-out",
  },
}

export default AnimationManager.getInstance()
