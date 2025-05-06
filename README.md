# ThreeJS Fractal Madness using Amazon Q

A WebGL-based retro demoscene experience using Three.js with psychedelic shaders and CRT effects. This project will show 5 different interactive fractals.

## About

**fractal-madness** is a tribute to the mathematics perfection, fractals, they are the representation of the beauty of the numbers, here will have just 5 of the most classic of them.

## Features

- **Multiple Visual Modes**:
  - Basic 3D scene with animated objects
  - Psychedelic shader with dynamic color patterns
  - CRT effect with scanlines, screen curvature, and RGB distortion
  - Sierpinski triangle fractal with mouse interaction
  - Interactive Julia set fractal with mouse control
  - Interactive Mandelbrot set fractal with mouse control
  - Interactive Newton-Raphson fractal with mouse control
  - Interactive Menger Sponge fractal with mouse control
  
- **Visual Effects**:
  - Animated 3D objects (cube, torus knot, sphere)
  - Dynamic psychedelic patterns using sine/cosine waves
  - Authentic CRT screen distortion (scanlines, curvature, RGB separation)
  - Screen jitter and noise simulation
  - Color cycling and pulsing effects
  - Interactive fractal mathematics visualization
  - Star Wars style scrolling text intro
  
- **Audio Integration**:
  - Background music playback with multiple tracks
  - Audio visualization that affects visual elements
  - Audio-reactive banner scrolling speed
  - Mute/unmute functionality
  
- **Interactive Controls**:
  - Scene switching button to cycle through visual styles
  - Audio mute/unmute button
  - Smooth transitions between scenes
  - Mouse/touch control for the fractals in Scenes 2, 3, 4, and 5
  
- **Classic Demoscene Elements**:
  - Star Wars style scrolling text intro in Scene 1
  - Scrolling banner text in other scenes
  - Color cycling effects
  - Synchronization between visuals and audio

## Setup and Running

1. **Installation**:
   ```bash
   git clone https://github.com/gara501/amazonqchallenge
   cd webgl-retro-demoscene
   ```

2. **Add Media Files**:
   - Place music files in the `assets` directory:
     - `music.mp3` - For Scene 1 (Original scene)
     - `music2.mp3` - For Scene 2 (Sierpinski triangle scene)
     - `music3.mp3` - For Scene 3 (Julia fractal scene)
     - `music4.mp3` - For Scene 4 (Mandelbrot fractal scene)
     - `music5.mp3` - For Scene 5 (Newton-Raphson fractal scene)
     - * all the music is free royalty music from https://pixabay.com/music/ *

3. **Run the Project**:
   ```bash
   npm run start
   ```
   This will start a local web server using `npx serve`.

4. **Alternative Methods**:
   You can also use:
   - Python: `python -m http.server`
   - Any other local web server of your choice

5. **Open in Browser**:
   Navigate to `http://localhost:3000` (or the port your server uses)

## Interactive Controls

The demo includes interactive controls that appear after loading:

- **Mute Button** (♪): Toggle audio on/off without stopping the visualization
- **Scene Button** (1/2/3/4/5): Cycle through the five different scenes:
  - Scene 1: The original scene with Star Wars style scrolling text
  - Scene 2: The Sierpinski triangle fractal scene with mouse interaction
  - Scene 3: The Julia set fractal scene with mouse interaction
  - Scene 4: The Mandelbrot set fractal scene with mouse interaction
  - Scene 5: The Newton-Raphson fractal scene with mouse interaction
  - Scene 6: The Menger Sponge fractal scene with mouse interaction
- **Mouse/Touch Controls**:
  - Move your mouse or finger across the screen in Scenes 2-5 to change the fractal parameters
  - In Scene 2 (Sierpinski): X-axis controls scale, Y-axis controls variation
  - In Scene 3 (Julia): Mouse position changes the constants in the Julia set equation
  - In Scene 4 (Mandelbrot): Mouse position changes the view offset
  - In Scene 5 (Newton-Raphson): X-axis controls polynomial degree, Y-axis controls relaxation factor
  - In Scene 6 (Menger Sponge): X-axis controls scale, Y-axis controls variation

## URL Parameters

You can switch between different initial visual modes using URL parameters, this will apply only to the first scene:

- `?effect=basic` - Basic 3D scene with objects
- `?effect=psychedelic` - Psychedelic shader effect
- `?effect=crt` - CRT distortion effect (default)

## Technical Details

### Technologies Used

- **Three.js** - 3D rendering library
- **WebGL** - Hardware-accelerated graphics
- **GLSL** - Shader programming language
- **Web Audio API** - Audio processing and visualization
- **ES6 Modules** - Modern JavaScript architecture

### File Structure

- `index.html` - Main HTML file with page structure
- `app.js` - Application entry point that initializes the appropriate effect
- `main.js` - Basic 3D scene setup with Three.js objects
- `shader_integration.js` - Psychedelic shader integration
- `crt_shader_integration.js` - CRT effect shader integration
- `sierpinski_scene.js` - Sierpinski triangle fractal scene implementation
- `fractal_scene.js` - Julia set fractal scene implementation
- `mandelbrot_scene.js` - Mandelbrot set fractal scene implementation
- `newton_scene.js` - Newton-Raphson fractal scene implementation
- `scene-controller.js` - Manages scene transitions and switching
- `audio-controller.js` - Handles audio playback and muting
- `banner.js` - Scrolling text banner controller
- `*.glsl` - GLSL shader files:
  - `psychedelic_fragment.glsl` - Fragment shader for psychedelic effect
  - `psychedelic_crt_fragment.glsl` - Fragment shader with CRT distortion
  - `sierpinski_fragment.glsl` - Fragment shader for Sierpinski triangle fractal
  - `sierpinski_vertex.glsl` - Vertex shader for Sierpinski triangle scene
  - `julia_fragment.glsl` - Fragment shader for Julia set fractal
  - `menger_fragment.glsl` - Fragment shader for Menger set fractal
  - `julia_vertex.glsl` - Vertex shader for Julia fractal scene
  - `mandelbrot_fragment.glsl` - Fragment shader for Mandelbrot set fractal
  - `mandelbrot_vertex.glsl` - Vertex shader for Mandelbrot scene
  - `newton_fragment.glsl` - Fragment shader for Newton-Raphson fractal
  - `newton_vertex.glsl` - Vertex shader for Newton-Raphson scene
  - `basic_vertex_shader.glsl` - Basic vertex shader
  - `menger_vertex.glsl` - Vertex shader for Menger scene
- `assets/` - Directory for media files:
  - `music.mp3` - Main background music for Scene 1
  - `music2.mp3` - Background music for Scene 2
  - `music3.mp3` - Background music for Scene 3
  - `music4.mp3` - Background music for Scene 4
  - `music5.mp3` - Background music for Scene 5
  - `music6.mp3` - Background music for Scene 6

### Shader Effects

The project includes seven main shader effects:

1. **Psychedelic Shader**:
   - Uses sine/cosine waves to create dynamic patterns
   - Implements color pulsing and transitions
   - Creates spiral and wave effects

2. **CRT Shader**:
   - Simulates CRT screen curvature
   - Creates scanlines effect
   - Implements RGB channel separation
   - Adds screen jitter and noise
   - Applies vignette darkening at edges

3. **Sierpinski Triangle Fractal Shader**:
   - Renders the classic Sierpinski triangle fractal
   - Uses iterative folding and transformation techniques
   - Features dynamic coloring based on distance calculations
   - Includes mouse interaction to control scale and variation
   - Reacts to audio input for dynamic effects

4. **Julia Set Fractal Shader**:
   - Renders a mathematical Julia set fractal
   - Reacts to mouse/touch input to change fractal parameters
   - Implements smooth coloring for beautiful visualization
   - Includes audio reactivity for dynamic zoom and color effects

5. **Mandelbrot Set Fractal Shader**:
   - Renders the classic Mandelbrot set fractal
   - Allows exploration through mouse/touch interaction
   - Features smooth color transitions and audio reactivity
   - Includes subtle animation and rotation effects

6. **Newton-Raphson Fractal Shader**:
   - Visualizes the Newton-Raphson method for finding roots of complex polynomials
   - Changes polynomial degree and relaxation factor based on mouse position
   - Creates distinct colored regions based on which root each point converges to
   - Features audio-reactive coloring and zoom effects

6. **Menger Sponge Fractal Shader**:
   - Renders a 3D Menger Sponge fractal using ray marching techniques
   - Uses distance field functions to create the recursive cube structure
   - Allows interactive control of scale and variation parameters via mouse position
   - Features dynamic rotation and animation based on time
   - Implements audio-reactive coloring and zoom effects that respond to music
   - Creates depth-based coloring with smooth palette transitions
   - Renders with realistic 3D lighting and perspective

## Browser Compatibility

This demo uses modern web technologies including:
- ES6 Modules with import maps
- WebGL 1.0/2.0
- Web Audio API

For the best experience, use a modern browser like Chrome, Firefox, or Edge.

## Note on Audio

Due to browser autoplay policies, audio will only start playing after user interaction. Click the prompt that appears to enable audio. You can also use the mute button to toggle audio on/off at any time.

## License

This project is licensed under the MIT License - see the package.json file for details.

## Acknowledgements

- Inspired by the perfection of the mathematical fractals and the great library ThreeJs.
- Built with Three.js (https://threejs.org/)
- Uses techniques from classic shader programming
- If you want to replicate with Amazon Q, just copy and paste all the prompts in order.

## PROMPTS IN AMAZON Q
You are an expert in Shaders, webGL and ThreeJS.
Create a minimal HTML file for a WebGL-based demo using Three.js. The canvas must fill the entire browser window with no scrollbars and load a JavaScript module named main.js.
In main.js, do the following:
### Scene 1: Psychedelic Intro
- Create a full-screen plane using a custom ShaderMaterial.
- Pass u_time and u_resolution as uniforms to both vertex and fragment shaders.
- Animate the scene using requestAnimationFrame.
- Write a basic vertex shader that directly passes the vertex position to gl_Position.
- Write a fragment shader that displays a colorful, animated, psychedelic effect using sine and cosine waves. Colors should change over time to evoke a retro 90s visual style.
- Overlay a CRT-style distortion effect: simulate scanlines, screen curvature, and RGB channel offsets to mimic an old monitor.
- Add a scrolling text banner like the Star Wars intro (from bottom to top), using either HTML/CSS or a Three.js text mesh.
- Load and autoplay a looping background track (assets/music1.mp3). Handle browser autoplay restrictions and add a button to mute/unmute the music.

### Scenes 2 to 6: Interactive Fractal Visuals
For each of the following five full-screen WebGL scenes, use a new fragment shader and its own background music:
- Scene 2: Julia Set — load music2.mp3
- Scene 3: Sierpinski Triangle — load music3.mp3
- Scene 4: Mandelbrot Set — load music4.mp3
- Scene 5: Newton-Raphson Set — load music5.mp3
- Scene 6: Menger Sponge — load music6.mp3

For all fractal scenes:
- Use ShaderMaterial with full-screen fragment shaders.
- Use u_time, u_resolution, and u_mouse as uniforms.
- Update fractal constants dynamically based on mouse movement.
- Each scene should render and update in real time.

### Navigation
- Create a button on the main page to switch between all six scenes.
- When a scene loads, the corresponding music file should also load and autoplay.
- For each scene containing a fractal, implement real-time dynamic interaction based on mouse movement. The mouse position should modify the constants used in the fractal’s equation. Each shader must include u_time and u_resolution uniforms, and the fractal should be rendered in real time. Create a navigation button on the main page that links to each individual fractal scene. Additionally, load and play the corresponding .mp3 audio file for each scene when it loads.
- In all scenes that display fractals, add a fixed text element centered on the screen. This text should show the mathematical formula of the corresponding fractal. Ensure the text has a legible color with sufficient contrast against the background. Additionally, implement a subtle flowing animation (e.g., shimmer or gentle wave) triggered when the user hovers the mouse over the text.
