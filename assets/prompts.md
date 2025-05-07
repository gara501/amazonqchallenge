Prompt 1
Create a minimal HTML file for a WebGL-based demo scene using Three.js. The canvas should fill the entire screen with no scrollbars, and load a JavaScript module called main.js.

Prompt 2
Create a JavaScript module main.js that uses Three.js to render a fullscreen plane with a custom shader material. Load the vertex and fragment shaders from ./shaders/vertex.glsl and ./shaders/fragment.glsl. Pass in time (u_time) and resolution (u_resolution) as uniforms. Animate the scene using requestAnimationFrame.

Prompt 3
Write a very basic vertex shader for a fullscreen plane. It should pass the vertex position directly to gl_Position.

Prompt 4
Create a fragment shader that displays a colorful, animated psychedelic effect using sine and cosine waves, based on the u_time and u_resolution uniforms. The colors should change dynamically over time, evoking a retro 90s visual style.

Prompt 5
In main.js, add logic to play a looping background music file called music.mp3 located in an assets/ folder. Make sure it autoplays and loops.
(Note: You may also want to mention how to deal with browser autoplay restrictions if needed.) Add a button to mute/play the music too. 

Prompt 6
Add a CRT-style screen distortion effect on top of the shader output. Simulate scanlines, subtle curvature, and RGB channel distortion to give the impression of an old CRT monitor.

Prompt 7 
Create a scrolling banner text overlay (e.g., at the bottom of the screen) using a separate HTML/CSS element or as a Three.js text object. It should move continuously from right to left, like in classic demoscene intros.

Prompt 8
Add a new button to change the scene, the new scene will be generated with a new shader material that use the images added in assets/images/ in addition the music will change to load music2.mp3

Prompt 9
implement this shader for the scene 2
vec2 uv = gl_FragCoord.xy / resolution.xy;
float offset = step(0.9, fract(sin(uv.y * 100.0 + u_time * 10.0) * 43758.5453));
uv.x += 0.02 * offset;
vec3 color = texture2D(u_texture, uv).rgb;
gl_FragColor = vec4(color, 1.0);

prompt 10
Create a full-screen WebGL fragment shader using Three.js and ShaderMaterial that renders a Julia set fractal. The fractal should react dynamically to mouse movement: moving the mouse changes the constants used in the Julia set equation. The project should include time and resolution uniforms, and display the fractal in real time. Create this in scene 3, create the button in main page to go to this scene. Load music3.mp3 when load this scene.

Propmt 11
Create a full-screen WebGL fragment shader using Three.js and ShaderMaterial that renders a Mandelbrot set fractal. The fractal should react dynamically to mouse movement: moving the mouse changes the constants used in the Mandelbrot set equation. The project should include time and resolution uniforms, and display the fractal in real time. Create this in scene 4, create the button in main page to go to this scene. Load music4.mp3 when load this scene.

Propmt 12
Create a full-screen WebGL fragment shader using Three.js and ShaderMaterial that renders a Newton-Raphson set fractal. The fractal should react dynamically to mouse movement: moving the mouse changes the constants used in the Newton-Raphson set equation. The project should include time and resolution uniforms, and display the fractal in real time. Create this in scene 5, create the button in main page to go to this scene. Load music5.mp3 when load this scene.


Prompt 13
Create a full-screen WebGL fragment shader using Three.js and ShaderMaterial that renders a Sierpinski triangle set fractal. The fractal should react dynamically to mouse movement: moving the mouse changes the constants used in the Sierpinski triangle set equation. The project should include time and resolution uniforms, and display the fractal in real time. Replace the scene 2 with these implementation.


Prompt 14
In the scenes where we have fractals add text in the center of the screen, this text will be in legible color and will have the fractal formula, this text will be fixed and it will have a settle flow animation when the mouse is passing over it. 

Prompt 15
Create a full-screen WebGL fragment shader using Three.js and ShaderMaterial that renders a menger sponge set fractal. The fractal should react dynamically to mouse movement: moving the mouse changes the constants used in the menger sponge set equation. The project should include time and resolution uniforms, and display the fractal in real time. Create this in scene 6, create the button in main page to go to this scene. Load music6.mp3 when load this scene.

Create a full-screen WebGL fragment shader using Three.js and ShaderMaterial that renders a Koch curve set fractal. The fractal should react dynamically to mouse movement: moving the mouse changes the constants used in the Koch curve set equation. The project should include time and resolution uniforms, and display the fractal in real time. Create this in scene 7, create the button in main page to go to this scene. Load music7.mp3 when load this scene.

Create a full-screen WebGL fragment shader using Three.js and ShaderMaterial that renders a Blood vessels set fractal. The fractal should react dynamically to mouse movement: moving the mouse changes the constants used in the Blood vessels set equation. The project should include time and resolution uniforms, and display the fractal in real time. Create this in scene 8, create the button in main page to go to this scene. Load music8.mp3 when load this scene.

Create a lateral menu on each scene with buttons to access to each scene, this menu will have beautiful buttons with subtle animations, add a transition when the scenes are entering