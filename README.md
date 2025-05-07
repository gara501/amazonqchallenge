# ThreeJS Fractal Madness using Amazon Q

A WebGL-based retro demoscene experience using Three.js with psychedelic shaders and CRT effects. This project showcases 9 different interactive fractals and visual effects.

## About

**fractal-madness** is a tribute to the mathematical perfection of fractals, which are the representation of the beauty of numbers. This project features 9 of the most classic and visually stunning fractals and visual effects.

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
  - Interactive Koch curve fractal with mouse control
  - Interactive Blood vessels fractal with mouse control
  - Interactive Atoms simulation with mouse control and philosophical quote
  
- **Visual Effects**:
  - Animated 3D objects (cube, torus knot, sphere)
  - Dynamic psychedelic patterns using sine/cosine waves
  - Authentic CRT screen distortion (scanlines, curvature, RGB separation)
  - Screen jitter and noise simulation
  - Color cycling and pulsing effects
  - Interactive fractal mathematics visualization
  - Star Wars style scrolling text intro
  - Quantum-inspired atom simulation with orbiting electrons
  
- **Audio Integration**:
  - Background music playback with multiple tracks
  - Audio visualization that affects visual elements
  - Audio-reactive banner scrolling speed
  - Mute/unmute functionality
  
- **Interactive Controls**:
  - Lateral menu with animated buttons for scene navigation
  - Audio mute/unmute button
  - Smooth transitions between scenes with circular reveal animation
  - Mouse/touch control for all interactive scenes
  
- **Classic Demoscene Elements**:
  - Star Wars style scrolling text intro in Scene 1
  - Scrolling banner text in other scenes
  - Color cycling effects
  - Synchronization between visuals and audio
  - Philosophical quote in the atoms scene

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
     - `music6.mp3` - For Scene 6 (Menger Sponge fractal scene)
     - `music7.mp3` - For Scene 7 (Koch curve fractal scene)
     - `music8.mp3` - For Scene 8 (Blood vessels fractal scene)
     - `music9.mp3` - For Scene 9 (Atoms simulation scene)
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
- **Lateral Menu**: A collapsible menu on the left side with buttons for all 9 scenes
- **Mouse/Touch Controls**:
  - Move your mouse or finger across the screen to change the parameters in each scene
  - In Scene 2 (Sierpinski): X-axis controls scale, Y-axis controls variation
  - In Scene 3 (Julia): Mouse position changes the constants in the Julia set equation
  - In Scene 4 (Mandelbrot): Mouse position changes the view offset
  - In Scene 5 (Newton-Raphson): X-axis controls polynomial degree, Y-axis controls relaxation factor
  - In Scene 6 (Menger Sponge): X-axis controls scale, Y-axis controls variation
  - In Scene 7 (Koch Curve): X-axis controls scale, Y-axis controls iterations
  - In Scene 8 (Blood Vessels): X-axis controls scale, Y-axis controls detail
  - In Scene 9 (Atoms): X-axis controls atom size, Y-axis controls number of electrons

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
- **MathJax** - For rendering mathematical formulas

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
- `menger_scene.js` - Menger Sponge fractal scene implementation
- `koch_scene.js` - Koch curve fractal scene implementation
- `blood_scene.js` - Blood vessels fractal scene implementation
- `atoms_scene.js` - Atoms simulation scene implementation
- `scene-controller.js` - Manages scene transitions and switching
- `audio-controller.js` - Handles audio playback and muting
- `banner.js` - Scrolling text banner controller
- `formula-controller.js` - Manages the display of mathematical formulas
- `lateral-menu.js` - Implements the side navigation menu
- `*.glsl` - GLSL shader files:
  - `psychedelic_fragment.glsl` - Fragment shader for psychedelic effect
  - `psychedelic_crt_fragment.glsl` - Fragment shader with CRT distortion
  - `sierpinski_fragment.glsl` - Fragment shader for Sierpinski triangle fractal
  - `sierpinski_vertex.glsl` - Vertex shader for Sierpinski triangle scene
  - `julia_fragment.glsl` - Fragment shader for Julia set fractal
  - `julia_vertex.glsl` - Vertex shader for Julia fractal scene
  - `mandelbrot_fragment.glsl` - Fragment shader for Mandelbrot set fractal
  - `mandelbrot_vertex.glsl` - Vertex shader for Mandelbrot scene
  - `newton_fragment.glsl` - Fragment shader for Newton-Raphson fractal
  - `newton_vertex.glsl` - Vertex shader for Newton-Raphson scene
  - `menger_fragment.glsl` - Fragment shader for Menger Sponge fractal
  - `menger_vertex.glsl` - Vertex shader for Menger Sponge scene
  - `koch_fragment.glsl` - Fragment shader for Koch curve fractal
  - `koch_vertex.glsl` - Vertex shader for Koch curve scene
  - `blood_fragment.glsl` - Fragment shader for Blood vessels fractal
  - `blood_vertex.glsl` - Vertex shader for Blood vessels scene
  - `atoms_fragment.glsl` - Fragment shader for Atoms simulation
  - `atoms_vertex.glsl` - Vertex shader for Atoms simulation scene
  - `basic_vertex_shader.glsl` - Basic vertex shader
- `assets/` - Directory for media files:
  - `music.mp3` - Background music for Scene 1
  - `music2.mp3` - Background music for Scene 2
  - `music3.mp3` - Background music for Scene 3
  - `music4.mp3` - Background music for Scene 4
  - `music5.mp3` - Background music for Scene 5
  - `music6.mp3` - Background music for Scene 6
  - `music7.mp3` - Background music for Scene 7
  - `music8.mp3` - Background music for Scene 8
  - `music9.mp3` - Background music for Scene 9

### Shader Effects

The project includes nine main shader effects:

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

7. **Menger Sponge Fractal Shader**:
   - Renders a 3D Menger Sponge fractal using ray marching techniques
   - Uses distance field functions to create the recursive cube structure
   - Allows interactive control of scale and variation parameters via mouse position
   - Features dynamic rotation and animation based on time
   - Implements audio-reactive coloring and zoom effects that respond to music
   - Creates depth-based coloring with smooth palette transitions
   - Renders with realistic 3D lighting and perspective

8. **Koch Curve Fractal Shader**:
   - Renders the classic Koch curve fractal using domain folding techniques
   - Creates a snowflake-like pattern with recursive detail
   - Allows control of scale and iteration depth via mouse position
   - Features dynamic rotation and animation based on time
   - Implements audio-reactive glow effects that pulse with the music

9. **Blood Vessels Fractal Shader**:
   - Creates organic, vessel-like patterns using domain warping and fractal Brownian motion
   - Features a red color palette reminiscent of blood vessels
   - Allows control of scale and detail via mouse position
   - Includes pulsing animations that sync with the audio
   - Creates a biological, organic feel with natural-looking structures

10. **Atoms Simulation Shader**:
    - Renders a quantum-inspired visualization with atoms that have nuclei and orbiting electrons
    - Features glowing particles and dynamic electron orbits
    - Allows control of atom size and electron count via mouse position
    - Includes audio reactivity for pulsing effects
    - Displays a philosophical quote about fractals and quantum physics
    - Creates a mesmerizing visualization of atomic structures

### UI Improvements

- **Lateral Menu**:
  - Collapsible sidebar menu for easy navigation between scenes
  - Animated buttons with distinct colors for each scene
  - Tooltips showing scene names on hover
  - Visual feedback for the active scene
  - Toggle button to show/hide the menu

- **Scene Transitions**:
  - Circular reveal animation when switching between scenes
  - Fade-in and scale animation for new scenes
  - Smooth timing for a polished experience

- **Formula Display**:
  - Mathematical formulas displayed for each fractal scene
  - Dynamic values that update as parameters change
  - Subtle hover animations
  - MathJax integration for proper mathematical notation

## Browser Compatibility

This demo uses modern web technologies including:
- ES6 Modules with import maps
- WebGL 1.0/2.0
- Web Audio API

For the best experience, use a modern browser like Chrome, Firefox, or Edge.

## Note on Audio

Due to browser autoplay policies, you may need to interact with the page (click anywhere) before audio will play. The mute button can be used to toggle audio on/off at any time.

## Credits

- All music is royalty-free from https://pixabay.com/music/
- Created with assistance from Amazon Q
- Fractal mathematics based on classic algorithms and modern shader techniques

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
- Create a menu on the main page to switch between all the scenes.
- When a scene loads, the corresponding music file should also load and autoplay.
- For each scene containing a fractal, implement real-time dynamic interaction based on mouse movement. The mouse position should modify the constants used in the fractal’s equation. Each shader must include u_time and u_resolution uniforms, and the fractal should be rendered in real time. Create a navigation button on the main page that links to each individual fractal scene. Additionally, load and play the corresponding .mp3 audio file for each scene when it loads.
- In all scenes that display fractals, add a fixed text element centered on the screen. This text should show the mathematical formula of the corresponding fractal. Ensure the text has a legible color with sufficient contrast against the background. Additionally, implement a subtle flowing animation (e.g., shimmer or gentle wave) triggered when the user hovers the mouse over the text.
-  Add this text in the center of the screen in the scene 9: "In the sacred dance of the universe, fractals mirror the infinite within the finite, each pattern echoing the breath of creation. Quantum physics whispers that reality is not solid, but woven from probabilities—just as fractals emerge from simple laws into endless complexity. In this harmony, spirit and science converge, revealing that the cosmos may be a divine self-reflecting dream." This quote won't overlap the formula text,
