/**
 * UIController.ts
 * Manages UI updates and user interactions
 */

export class UIController {
  private fpsElement: HTMLElement;
  private modeElement: HTMLElement;
  private resolutionElement: HTMLElement;
  private processTimeElement: HTMLElement;
  private statusElement: HTMLElement;
  private startBtn: HTMLButtonElement;
  private toggleBtn: HTMLButtonElement;

  constructor() {
    this.fpsElement = document.getElementById('fps')!;
    this.modeElement = document.getElementById('mode')!;
    this.resolutionElement = document.getElementById('resolution')!;
    this.processTimeElement = document.getElementById('processTime')!;
    this.statusElement = document.getElementById('status')!;
    this.startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    this.toggleBtn = document.getElementById('toggleBtn') as HTMLButtonElement;
  }

  /**
   * Update FPS display
   */
  public updateFPS(fps: number): void {
    this.fpsElement.textContent = fps.toString();
  }

  /**
   * Update processing mode
   */
  public updateMode(mode: string): void {
    this.modeElement.textContent = mode;
  }

  /**
   * Update resolution display
   */
  public updateResolution(width: number, height: number): void {
    this.resolutionElement.textContent = `${width} x ${height}`;
  }

  /**
   * Update processing time
   */
  public updateProcessingTime(time: number): void {
    this.processTimeElement.textContent = `${time} ms`;
  }

  /**
   * Update status message
   */
  public updateStatus(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    this.statusElement.textContent = message;
    this.statusElement.style.background = 
      type === 'error' ? 'rgba(255, 0, 0, 0.2)' :
      type === 'success' ? 'rgba(0, 255, 0, 0.2)' :
      'rgba(255, 255, 255, 0.1)';
  }

  /**
   * Enable/disable start button
   */
  public setStartButtonEnabled(enabled: boolean): void {
    this.startBtn.disabled = !enabled;
  }

  /**
   * Enable/disable toggle button
   */
  public setToggleButtonEnabled(enabled: boolean): void {
    this.toggleBtn.disabled = !enabled;
  }

  /**
   * Update start button text
   */
  public setStartButtonText(text: string): void {
    this.startBtn.textContent = text;
  }

  /**
   * Update toggle button text
   */
  public setToggleButtonText(text: string): void {
    this.toggleBtn.textContent = text;
  }

  /**
   * Get start button element
   */
  public getStartButton(): HTMLButtonElement {
    return this.startBtn;
  }

  /**
   * Get toggle button element
   */
  public getToggleButton(): HTMLButtonElement {
    return this.toggleBtn;
  }

  /**
   * Show loading indicator
   */
  public showLoading(show: boolean): void {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.display = show ? 'block' : 'none';
    }
  }
}