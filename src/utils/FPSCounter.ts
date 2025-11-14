/**
 * FPSCounter.ts
 * Calculates frames per second for performance monitoring
 */

export class FPSCounter {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 0;

  /**
   * Update frame count and calculate FPS
   * @returns Current FPS value
   */
  public update(): number {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Calculate FPS every second
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    return this.fps;
  }

  /**
   * Get current FPS value
   */
  public getFPS(): number {
    return this.fps;
  }

  /**
   * Reset the counter
   */
  public reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;
  }
}