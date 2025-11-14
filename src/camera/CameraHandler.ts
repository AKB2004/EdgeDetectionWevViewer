/**
 * CameraHandler.ts
 * Handles webcam access and frame capture using WebRTC
 */

export class CameraHandler {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stream: MediaStream | null = null;
  private isActive: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    // Create hidden video element for camera feed
    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.playsInline = true;
  }

  /**
   * Start camera capture
   */
  public async start(): Promise<void> {
    try {
      // Request camera access
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      this.video.srcObject = this.stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          resolve();
        };
      });

      this.isActive = true;
      
      // Set canvas size to match video
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

    } catch (error) {
      console.error('Error accessing camera:', error);
      throw new Error('Failed to access camera. Please check permissions.');
    }
  }

  /**
   * Capture current frame to canvas
   */
  public captureFrame(): void {
    if (!this.isActive || !this.video.videoWidth) return;

    this.ctx.drawImage(
      this.video,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  /**
   * Get current frame as ImageData
   */
  public getFrameData(): ImageData {
    return this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  /**
   * Get video dimensions
   */
  public getDimensions(): { width: number; height: number } {
    return {
      width: this.video.videoWidth || 640,
      height: this.video.videoHeight || 480
    };
  }

  /**
   * Check if camera is active
   */
  public isRunning(): boolean {
    return this.isActive;
  }

  /**
   * Stop camera and release resources
   */
  public stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isActive = false;
  }
}