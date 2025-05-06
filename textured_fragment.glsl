// Textured fragment shader with retro effects and glitch
precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform float u_audioLevel; // Audio level for reactivity
uniform sampler2D u_texture1; // Main texture
uniform sampler2D u_texture2; // Secondary texture
uniform sampler2D u_background; // Background texture

// Constants for the effect
const float SCAN_SPEED = 0.5;
const float DISTORTION = 0.03;
const float TEXTURE_MIX = 0.7;
const float VIGNETTE_STRENGTH = 0.5;
const float GLITCH_INTENSITY = 1.0;

// Varying from vertex shader
varying vec2 vUv;

// Function to create a distorted UV coordinate
vec2 distortUV(vec2 uv, float time) {
    // Apply wave distortion
    float distortionX = sin(uv.y * 10.0 + time) * DISTORTION * u_audioLevel;
    float distortionY = cos(uv.x * 10.0 + time * 0.7) * DISTORTION * u_audioLevel;
    
    // Apply the distortion
    return uv + vec2(distortionX, distortionY);
}

// Function to create a vignette effect
float vignette(vec2 uv) {
    uv = uv * 2.0 - 1.0; // Convert to -1 to 1
    float vignetteAmount = 1.0 - dot(uv, uv) * VIGNETTE_STRENGTH;
    return clamp(vignetteAmount, 0.0, 1.0);
}

// Function to create scanlines
float scanlines(vec2 uv, float time) {
    float scanline = sin(uv.y * u_resolution.y * 0.5 - time * 10.0) * 0.5 + 0.5;
    return 0.95 + 0.05 * scanline;
}

// Function to create a glitch effect as specified
vec2 applyGlitch(vec2 uv, float time) {
    // Implement the provided glitch effect
    float offset = step(0.9, fract(sin(uv.y * 100.0 + time * 10.0) * 43758.5453));
    
    // Scale the effect by audio level and glitch intensity
    float glitchAmount = 0.02 * offset * GLITCH_INTENSITY * (1.0 + u_audioLevel);
    
    // Apply the horizontal offset
    uv.x += glitchAmount;
    
    return uv;
}

// Function to create a more complex glitch effect
vec2 glitchUV(vec2 uv, float time) {
    // Create occasional horizontal glitches
    float glitchStrength = 0.01 * u_audioLevel * step(0.97, sin(time * 1.3) * 0.5 + 0.5);
    float lineOffset = step(0.5, fract(uv.y * 20.0)) * glitchStrength;
    
    // Apply the glitch
    return uv + vec2(lineOffset, 0.0);
}

void main() {
    // Get normalized pixel coordinates
    vec2 uv = vUv;
    
    // Apply time-based animation
    float time = u_time * SCAN_SPEED;
    
    // Apply the specified glitch effect
    uv = applyGlitch(uv, time);
    
    // Apply additional distortion and glitch effects
    vec2 distortedUV1 = distortUV(uv, time);
    vec2 distortedUV2 = distortUV(uv, time + 1.57);
    vec2 glitchedUV = glitchUV(uv, time);
    
    // Sample textures with different distortions
    vec4 texColor1 = texture2D(u_texture1, distortedUV1);
    vec4 texColor2 = texture2D(u_texture2, distortedUV2);
    vec4 bgColor = texture2D(u_background, glitchedUV);
    
    // Mix textures based on time and audio level
    float mixFactor = sin(time * 0.2) * 0.5 + 0.5;
    mixFactor = mixFactor * TEXTURE_MIX + (1.0 - TEXTURE_MIX) * 0.5;
    mixFactor = mixFactor + u_audioLevel * 0.2;
    
    // Combine textures
    vec4 combinedTexture = mix(texColor1, texColor2, mixFactor);
    vec4 finalColor = mix(bgColor, combinedTexture, 0.7);
    
    // Apply scanlines
    finalColor.rgb *= scanlines(uv, time);
    
    // Apply vignette
    finalColor.rgb *= vignette(uv);
    
    // Apply color shifting based on audio level
    float colorShift = u_audioLevel * 0.1;
    finalColor.r += colorShift;
    finalColor.b -= colorShift;
    
    // Apply pulsing brightness based on audio
    float brightnessPulse = 1.0 + u_audioLevel * 0.2;
    finalColor.rgb *= brightnessPulse;
    
    // Output the final color
    gl_FragColor = finalColor;
}