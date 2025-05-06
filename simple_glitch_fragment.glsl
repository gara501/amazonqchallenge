// Simple glitch fragment shader
precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform float u_audioLevel; // Audio level for reactivity
uniform sampler2D u_texture1; // Main texture

// Varying from vertex shader
varying vec2 vUv;

void main() {
    // Get normalized pixel coordinates
    vec2 uv = vUv;
    
    // Create the glitch effect exactly as specified
    float offset = step(0.9, fract(sin(uv.y * 100.0 + u_time * 10.0) * 43758.5453));
    uv.x += 0.02 * offset;
    
    // Sample the texture with the glitched coordinates
    vec3 color = texture2D(u_texture1, uv).rgb;
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}