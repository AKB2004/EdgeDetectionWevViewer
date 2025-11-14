/**
 * main.ts
 * Main application entry point - orchestrates all components
 */

import { CameraHandler } from './camera/CameraHandler';
import { OpenCVProcessor } from './processing/OpenCVProcessor';
import { WebGLRenderer } from './rendering/WebGLRenderer';
import { UIController } from './ui/UIController';
import { FPSCounter } from './utils/FPSCounter';

class EdgeDetectionApp {
  private camera: CameraHandler;
  private processor: OpenCVProcessor;
  private renderer: WebGLRenderer;
  private ui: UIController;
  private fpsCounter: FPSCounter;

  private isRunning: boolean = false;
  private processingEnabled: boolean = true;
  private animationFrameId: number = 0;

  constructor() {
    // Get canvas elements
    const inputCanvas = document.getElementById('inputCanvas') as HTMLCanvasElement;
    const outputCanvas = document.getElementById('outputCanvas') as HTMLCanvasElement;

    // Initialize components
    this.camera = new CameraHandler(inputCanvas);
    this.processor = new OpenCVProcessor();
    this.renderer = new WebGLRenderer(outputCanvas);
    this.ui = new UIController();
    this.fpsCounter = new FPSCounter();

    this.setupEventListeners();
    this.initializeOpenCV();
  }

  /**
   * Initialize OpenCV.js
   */
  private async initializeOpenCV(): Promise<void> {
    this.ui.showLoading(true);
    this.ui.updateStatus('Loading OpenCV.js...', 'info');

    try {
      await this.processor.initialize();
      this.ui.updateStatus('OpenCV.js loaded successfully! Click Start Camera to begin.', 'success');
      this.ui.setStartButtonEnabled(true);
    } catch (error) {
      console.error('Failed to initialize OpenCV:', error);
      this.ui.updateStatus('Failed to load OpenCV.js. Please refresh the page.', 'error');
    } finally {
      this.ui.showLoading(false);
    }
  }

  /**
   * Setup event listeners for buttons
   */
  private setupEventListeners(): void {
    // Start/Stop button
    this.ui.getStartButton().addEventListener('click', () => {
      if (!this.isRunning) {
        this.startCamera();
      } else {
        this.stopCamera();
      }
    });

    // Toggle processing button
    this.ui.getToggleButton().addEventListener('click', () => {
      this.processingEnabled = !this.processingEnabled;
      this.ui.updateMode(
        this.processingEnabled ? 'Edge Detection' : 'Raw Feed'
      );
      this.ui.setToggleButtonText(
        this.processingEnabled ? '🔄 Show Raw Feed' : '🔄 Show Edge Detection'
      );
    });
  }

  /**
   * Start camera and begin processing
   */
  private async startCamera(): Promise<void> {
    try {
      this.ui.updateStatus('Starting camera...', 'info');
      this.ui.setStartButtonEnabled(false);

      await this.camera.start();

      const { width, height } = this.camera.getDimensions();
      this.renderer.resize(width, height);
      this.ui.updateResolution(width, height);

      this.isRunning = true;
      this.ui.setStartButtonText('⏹️ Stop Camera');
      this.ui.setToggleButtonEnabled(true);
      this.ui.updateStatus('Camera active - Processing frames', 'success');
      this.ui.updateMode('Edge Detection');

      this.processLoop();

    } catch (error) {
      console.error('Failed to start camera:', error);
      this.ui.updateStatus('Failed to access camera. Please check permissions.', 'error');
      this.ui.setStartButtonEnabled(true);
    }
  }

  /**
   * Stop camera and processing
   */
  private stopCamera(): void {
    this.isRunning = false;
    this.camera.stop();
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.ui.setStartButtonText('🚀 Start Camera');
    this.ui.setStartButtonEnabled(true);
    this.ui.setToggleButtonEnabled(false);
    this.ui.updateStatus('Camera stopped', 'info');
    this.ui.updateMode('Idle');
    this.fpsCounter.reset();
  }

  /**
   * Main processing loop
   */
  private processLoop = (): void => {
    if (!this.isRunning) return;

    // Capture frame from camera
    this.camera.captureFrame();
    const frameData = this.camera.getFrameData();

    // Process or pass-through based on toggle
    const outputData = this.processingEnabled
      ? this.processor.processFrame(frameData)
      : frameData;

    // Render using WebGL
    this.renderer.render(outputData);

    // Update UI stats
    const fps = this.fpsCounter.update();
    this.ui.updateFPS(fps);
    this.ui.updateProcessingTime(this.processor.getProcessingTime());

    // Continue loop
    this.animationFrameId = requestAnimationFrame(this.processLoop);
  };

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.stopCamera();
    this.processor.cleanup();
    this.renderer.cleanup();
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new EdgeDetectionApp();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    app.cleanup();
  });
});