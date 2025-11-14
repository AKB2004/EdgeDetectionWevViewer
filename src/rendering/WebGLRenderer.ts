/**
 * WebGLRenderer.ts
 * Renders processed frames using WebGL with texture mapping
 */

export class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private texture: WebGLTexture;
  private positionBuffer: WebGLBuffer;
  private texCoordBuffer: WebGLBuffer;

  // Vertex shader - defines position of vertices
  private vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;

  // Fragment shader - renders texture
  private fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;

    void main() {
      gl_FragColor = texture2D(u_texture, v_texCoord);
    }
  `;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Get WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    this.gl = gl as WebGLRenderingContext;

    // Initialize WebGL
    this.program = this.createProgram();
    this.texture = this.createTexture();
    this.positionBuffer = this.createPositionBuffer();
    this.texCoordBuffer = this.createTexCoordBuffer();

    this.setupAttributes();
  }

  /**
   * Create and compile shader program
   */
  private createProgram(): WebGLProgram {
    const vertexShader = this.compileShader(
      this.vertexShaderSource,
      this.gl.VERTEX_SHADER
    );
    const fragmentShader = this.compileShader(
      this.fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    );

    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error('Failed to link program: ' + this.gl.getProgramInfoLog(program));
    }

    return program;
  }

  /**
   * Compile individual shader
   */
  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Shader compilation error: ' + this.gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  /**
   * Create texture object
   */
  private createTexture(): WebGLTexture {
    const texture = this.gl.createTexture()!;
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Set texture parameters
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return texture;
  }

  /**
   * Create position buffer (rectangle covering entire canvas)
   */
  private createPositionBuffer(): WebGLBuffer {
    const buffer = this.gl.createBuffer()!;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

    const positions = new Float32Array([
      -1.0, -1.0,  // Bottom-left
       1.0, -1.0,  // Bottom-right
      -1.0,  1.0,  // Top-left
       1.0,  1.0   // Top-right
    ]);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    return buffer;
  }

  /**
   * Create texture coordinate buffer
   */
  private createTexCoordBuffer(): WebGLBuffer {
    const buffer = this.gl.createBuffer()!;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

    const texCoords = new Float32Array([
      0.0, 1.0,  // Bottom-left
      1.0, 1.0,  // Bottom-right
      0.0, 0.0,  // Top-left
      1.0, 0.0   // Top-right
    ]);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);
    return buffer;
  }

  /**
   * Setup vertex attributes
   */
  private setupAttributes(): void {
    this.gl.useProgram(this.program);

    // Position attribute
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Texture coordinate attribute
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  /**
   * Render ImageData to canvas using WebGL
   */
  public render(imageData: ImageData): void {
    // Update texture with new image data
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      imageData
    );

    // Set viewport and clear
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Draw the quad with texture
    this.gl.useProgram(this.program);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  /**
   * Resize canvas and update viewport
   */
  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  /**
   * Clean up WebGL resources
   */
  public cleanup(): void {
    this.gl.deleteTexture(this.texture);
    this.gl.deleteBuffer(this.positionBuffer);
    this.gl.deleteBuffer(this.texCoordBuffer);
    this.gl.deleteProgram(this.program);
  }
}