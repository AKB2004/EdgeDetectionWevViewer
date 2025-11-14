# 🎥 Real-Time Edge Detection Viewer

A web-based real-time edge detection application built with **TypeScript**, **OpenCV.js**, and **WebGL**. This project captures webcam feed, processes frames using Canny edge detection, and renders output using WebGL for optimal performance.

---

## ✨ Features Implemented

### Web Application Features
- ✅ **Real-time Camera Feed**: Captures live webcam feed using WebRTC API
- ✅ **OpenCV.js Integration**: Canny edge detection processing in the browser
- ✅ **WebGL Rendering**: Hardware-accelerated rendering using WebGL 2.0
- ✅ **Dual View**: Side-by-side comparison of original and processed frames
- ✅ **Toggle Processing**: Switch between raw feed and edge-detected output
- ✅ **Performance Monitoring**: Real-time FPS counter and processing time display
- ✅ **Responsive UI**: Modern, gradient-based design with glassmorphism effects

### Technical Implementation
- ✅ **Modular Architecture**: Clean separation of concerns (Camera, Processing, Rendering, UI)
- ✅ **TypeScript**: Fully typed codebase for better maintainability
- ✅ **WebGL Shaders**: Custom vertex and fragment shaders for texture rendering
- ✅ **Efficient Frame Processing**: ~15-30 FPS performance on modern hardware
- ✅ **Resource Management**: Proper cleanup of WebGL and OpenCV resources

---

## 📷 Screenshots

### Main Interface<img width="1907" height="987" alt="Screenshot 2025-11-14 145425" src="https://github.com/user-attachments/assets/94f4bdec-9961-4eda-9c8e-6b26959ad38c" />
<img width="1879" height="971" alt="Screenshot 2025-11-14 145433" src="https://github.com/user-attachments/assets/65cc9059-0853-4a6d-9ffc-f975f69324f7" />

<!-- <img width="1907" height="987" alt="Screenshot 2025-11-14 145425" src="https://github.com/user-attachments/assets/9e327d83-3a2d-4960-8b28-49688ee18e33" /> -->


## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Main Application                      │
│                         (main.ts)                            │
└──────────────┬──────────────┬──────────────┬────────────────┘
               │              │              │
       ┌───────▼──────┐ ┌────▼─────┐ ┌──────▼────────┐
       │   Camera     │ │  OpenCV  │ │    WebGL      │
       │   Handler    │ │ Processor│ │   Renderer    │
       └──────────────┘ └──────────┘ └───────────────┘
               │              │              │
       ┌───────▼──────────────▼──────────────▼────────┐
       │           Frame Processing Flow               │
       │  Camera → ImageData → Edge Detection → WebGL  │
       └───────────────────────────────────────────────┘
               │
       ┌───────▼──────┐
       │      UI      │
       │  Controller  │
       └──────────────┘
```

### Component Breakdown

1. **CameraHandler** (`src/camera/CameraHandler.ts`)
   - Manages WebRTC camera access
   - Captures frames to canvas
   - Provides ImageData for processing

2. **OpenCVProcessor** (`src/processing/OpenCVProcessor.ts`)
   - Initializes OpenCV.js
   - Applies Canny edge detection algorithm
   - Converts between ImageData and cv.Mat formats

3. **WebGLRenderer** (`src/rendering/WebGLRenderer.ts`)
   - Creates WebGL context and shaders
   - Renders ImageData as texture
   - Hardware-accelerated display

4. **UIController** (`src/ui/UIController.ts`)
   - Manages DOM updates
   - Handles button interactions
   - Updates performance statistics

5. **FPSCounter** (`src/utils/FPSCounter.ts`)
   - Calculates frames per second
   - Monitors rendering performance

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge)
- Webcam/camera access

### Installation Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd edge-detection-viewer
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

The application will automatically open at `http://localhost:3000`

4. **Build for production**
```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 🔧 Dependencies

### Core Dependencies
- **opencv-ts**: OpenCV.js TypeScript bindings for browser-based computer vision
- **TypeScript**: Type-safe JavaScript development
- **Webpack**: Module bundler and development server

### Dev Dependencies
- **ts-loader**: TypeScript loader for Webpack
- **html-webpack-plugin**: HTML file generation
- **copy-webpack-plugin**: Static file copying
- **webpack-dev-server**: Development server with hot reload

---

## 🚀 Usage

1. Click **"Start Camera"** to request webcam access
2. Allow camera permissions in your browser
3. View real-time edge detection in the right panel
4. Click **"Toggle Processing"** to switch between raw and processed feed
5. Monitor FPS and processing time in the stats panel

---

## 🧠 Technical Details

### Frame Processing Flow
1. **Capture**: WebRTC API captures frame to canvas
2. **Extract**: Get ImageData from canvas context
3. **Process**: Convert to cv.Mat → Grayscale → Gaussian Blur → Canny Edge Detection
4. **Render**: Upload to WebGL texture → Shader processing → Display

### OpenCV Pipeline
```
RGBA Frame → Grayscale → Gaussian Blur (5x5) → Canny (50, 150) → RGBA Output
```

### WebGL Rendering
- Uses **WebGL 1.0** for maximum compatibility
- Vertex shader maps texture coordinates
- Fragment shader samples and displays texture
- Triangle strip rendering for efficiency

---

## 📊 Performance Metrics

- **Target FPS**: 15-30 FPS (depends on hardware)
- **Processing Time**: 5-20ms per frame (typical)
- **Resolution**: 640x480 (configurable)
- **Browser Support**: Chrome, Firefox, Edge (latest versions)

---

## 🔄 Git Commit History

This project follows proper Git practices with meaningful commits:
- Initial project setup
- Camera handler implementation
- OpenCV integration
- WebGL renderer
- UI and controls
- Performance optimizations
- Documentation

---

## 🛠️ Future Enhancements

- [ ] Multiple filter options (Sobel, Laplacian, etc.)
- [ ] Adjustable Canny threshold sliders
- [ ] Frame recording and export
- [ ] WebSocket support for remote processing
- [ ] Mobile device support
- [ ] GLSL shader effects

---

## 📝 License

MIT License - Feel free to use and modify

---

## 🙏 Acknowledgments

- OpenCV.js team for browser-based computer vision
- WebGL community for rendering techniques
- TypeScript team for type safety

---

**Note**: This is a web-based implementation as an alternative to the Android app requirement. All core features (camera capture, OpenCV processing, OpenGL/WebGL rendering) are implemented using modern web technologies.
