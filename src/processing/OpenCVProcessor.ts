/**
 * OpenCVProcessor.ts
 * Handles image processing using OpenCV.js (Canny Edge Detection)
 */

declare const cv: any;

export class OpenCVProcessor {
  private isReady: boolean = false;
  private mat: any = null;
  private grayMat: any = null;
  private edgeMat: any = null;
  private processingTime: number = 0;

  /**
   * Initialize OpenCV and wait for it to be ready
   */
  public async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof cv === 'undefined') {
        reject(new Error('OpenCV.js not loaded'));
        return;
      }

      if (cv.getBuildInformation) {
        this.isReady = true;
        console.log('OpenCV.js is ready');
        resolve();
      } else {
        cv['onRuntimeInitialized'] = () => {
          this.isReady = true;
          console.log('OpenCV.js initialized');
          resolve();
        };
      }

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isReady) {
          reject(new Error('OpenCV.js initialization timeout'));
        }
      }, 10000);
    });
  }

  /**
   * Process frame with Canny Edge Detection
   * @param imageData - Input frame data
   * @returns Processed ImageData
   */
  public processFrame(imageData: ImageData): ImageData {
    if (!this.isReady) {
      throw new Error('OpenCV not ready');
    }

    const startTime = performance.now();

    try {
      // Convert ImageData to cv.Mat
      if (!this.mat) {
        this.mat = cv.matFromImageData(imageData);
        this.grayMat = new cv.Mat();
        this.edgeMat = new cv.Mat();
      } else {
        this.mat = cv.matFromImageData(imageData);
      }

      // Convert to grayscale
      cv.cvtColor(this.mat, this.grayMat, cv.COLOR_RGBA2GRAY);

      // Apply Gaussian Blur to reduce noise
      cv.GaussianBlur(
        this.grayMat,
        this.grayMat,
        new cv.Size(5, 5),
        0,
        0,
        cv.BORDER_DEFAULT
      );

      // Apply Canny Edge Detection
      cv.Canny(this.grayMat, this.edgeMat, 50, 150);

      // Convert back to RGBA for display
      cv.cvtColor(this.edgeMat, this.mat, cv.COLOR_GRAY2RGBA);

      // Convert cv.Mat back to ImageData
      const processedData = new ImageData(
        new Uint8ClampedArray(this.mat.data),
        this.mat.cols,
        this.mat.rows
      );

      this.processingTime = performance.now() - startTime;

      return processedData;

    } catch (error) {
      console.error('Error processing frame:', error);
      this.processingTime = performance.now() - startTime;
      return imageData; // Return original on error
    }
  }

  /**
   * Process frame with simple grayscale (alternative mode)
   */
  public processGrayscale(imageData: ImageData): ImageData {
    if (!this.isReady) return imageData;

    try {
      const startTime = performance.now();

      if (!this.mat) {
        this.mat = cv.matFromImageData(imageData);
        this.grayMat = new cv.Mat();
      } else {
        this.mat = cv.matFromImageData(imageData);
      }

      // Convert to grayscale
      cv.cvtColor(this.mat, this.grayMat, cv.COLOR_RGBA2GRAY);
      cv.cvtColor(this.grayMat, this.mat, cv.COLOR_GRAY2RGBA);

      const processedData = new ImageData(
        new Uint8ClampedArray(this.mat.data),
        this.mat.cols,
        this.mat.rows
      );

      this.processingTime = performance.now() - startTime;
      return processedData;

    } catch (error) {
      console.error('Error in grayscale processing:', error);
      return imageData;
    }
  }

  /**
   * Get last processing time in milliseconds
   */
  public getProcessingTime(): number {
    return Math.round(this.processingTime * 100) / 100;
  }

  /**
   * Check if OpenCV is ready
   */
  public ready(): boolean {
    return this.isReady;
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    try {
      if (this.mat) this.mat.delete();
      if (this.grayMat) this.grayMat.delete();
      if (this.edgeMat) this.edgeMat.delete();
    } catch (error) {
      console.error('Error cleaning up OpenCV resources:', error);
    }
  }
}