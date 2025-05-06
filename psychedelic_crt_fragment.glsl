// Psychedelic fragment shader with retro 90s visual style and CRT effects
precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)

// Constants for the psychedelic effect
const float SPEED = 0.5;
const float INTENSITY = 1.2;
const float COMPLEXITY = 3.0;

// Constants for CRT effect
const float SCANLINE_INTENSITY = 0.15;     // Intensity of scanlines
const float SCANLINE_COUNT = 240.0;        // Number of scanlines
const float CURVATURE = 0.1;               // Screen curvature amount
const float RGB_OFFSET = 0.003;            // RGB channel separation amount
const float VIGNETTE_INTENSITY = 0.3;      // Darkening at the edges
const float FLICKER_INTENSITY = 0.03;      // Screen flicker intensity
const float NOISE_INTENSITY = 0.02;        // Static noise intensity
const float JITTER_INTENSITY = 0.007;      // Horizontal jitter intensity
const float VERTICAL_JITTER = 0.01;        // Vertical sync jitter

// Function to create a smooth color transition
vec3 colorPulse(float t, vec3 color1, vec3 color2, vec3 color3) {
    float p = fract(t);
    if (p < 0.33) {
        return mix(color1, color2, p * 3.0);
    } else if (p < 0.66) {
        return mix(color2, color3, (p - 0.33) * 3.0);
    } else {
        return mix(color3, color1, (p - 0.66) * 3.0);
    }
}

// Random function for noise generation
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Apply CRT screen curvature distortion
vec2 curveRemapUV(vec2 uv) {
    // Convert to -1 to 1 range
    vec2 cuv = uv * 2.0 - 1.0;
    
    // Apply quadratic curvature
    vec2 offset = abs(cuv.yx) / vec2(6.0, 4.0);
    cuv = cuv + cuv * offset * offset * CURVATURE;
    
    // Convert back to 0-1 range and check bounds
    cuv = cuv * 0.5 + 0.5;
    
    return cuv;
}

// Generate the base psychedelic pattern
vec3 generatePsychedelicPattern(vec2 uv) {
    // Calculate distance from center
    float dist = length(uv);
    
    // Calculate angle from center
    float angle = atan(uv.y, uv.x);
    
    // Create time-based variables for animation
    float t1 = u_time * SPEED;
    float t2 = u_time * SPEED * 0.7;
    
    // Create wave patterns
    float wave1 = sin(dist * 10.0 + t1) * 0.5 + 0.5;
    float wave2 = cos(angle * 8.0 + t2) * 0.5 + 0.5;
    float wave3 = sin(dist * 15.0 - angle * 6.0 + t1 * 1.3) * 0.5 + 0.5;
    float wave4 = cos(dist * 8.0 + angle * 4.0 - t2 * 1.1) * 0.5 + 0.5;
    
    // Create spiral effect
    float spiral = sin(dist * COMPLEXITY * 10.0 - angle * 10.0 + t1 * 2.0) * 0.5 + 0.5;
    
    // Combine waves with different weights
    float pattern = wave1 * 0.3 + wave2 * 0.2 + wave3 * 0.25 + wave4 * 0.25 + spiral * INTENSITY;
    
    // Create pulsating colors - bright neon colors for 90s retro feel
    vec3 color1 = vec3(1.0, 0.2, 0.8);  // Hot pink
    vec3 color2 = vec3(0.2, 0.8, 1.0);  // Cyan
    vec3 color3 = vec3(1.0, 0.9, 0.1);  // Yellow
    
    // Create secondary colors
    vec3 color4 = vec3(0.6, 0.0, 1.0);  // Purple
    vec3 color5 = vec3(0.0, 1.0, 0.5);  // Green
    
    // Create color pulses at different rates
    vec3 pulseA = colorPulse(t1 * 0.2, color1, color2, color3);
    vec3 pulseB = colorPulse(t1 * 0.1 + 0.3, color3, color4, color5);
    
    // Mix colors based on the pattern
    vec3 finalColor = mix(pulseA, pulseB, pattern);
    
    // Add some brightness variation
    finalColor *= 0.8 + 0.4 * sin(t1 + dist * 5.0);
    
    return finalColor;
}

void main() {
    // Get normalized pixel coordinates (0 to 1)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Apply screen jitter effect (horizontal)
    float jitterOffset = sin(u_time * 5.0 + uv.y * 20.0) * JITTER_INTENSITY;
    
    // Apply vertical sync jitter (occasional vertical jump)
    float verticalJump = step(0.99, sin(u_time * 0.3) * 0.5 + 0.5) * VERTICAL_JITTER;
    verticalJump *= step(0.5, random(vec2(floor(u_time * 0.6), 0.0)));
    
    // Apply the jitter to UV coordinates
    uv.x += jitterOffset;
    uv.y += verticalJump;
    
    // Apply screen curvature
    vec2 curvedUV = curveRemapUV(uv);
    
    // Check if we're outside the curved screen bounds
    if (curvedUV.x < 0.0 || curvedUV.x > 1.0 || curvedUV.y < 0.0 || curvedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Normalize coordinates for psychedelic effect
    vec2 normalizedUV = (curvedUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
    
    // Generate base psychedelic pattern
    vec3 baseColor = generatePsychedelicPattern(normalizedUV);
    
    // Apply RGB channel separation
    float r = generatePsychedelicPattern(normalizedUV + vec2(RGB_OFFSET, 0.0)).r;
    float g = baseColor.g;
    float b = generatePsychedelicPattern(normalizedUV - vec2(RGB_OFFSET, 0.0)).b;
    vec3 color = vec3(r, g, b);
    
    // Apply scanlines
    float scanline = sin(curvedUV.y * SCANLINE_COUNT * 3.14159) * 0.5 + 0.5;
    scanline = pow(scanline, 0.5); // Adjust scanline shape
    color *= 1.0 - (scanline * SCANLINE_INTENSITY);
    
    // Apply screen flicker
    float flicker = 1.0 - FLICKER_INTENSITY * random(vec2(floor(u_time * 24.0), 0.0));
    color *= flicker;
    
    // Apply static noise
    float noise = random(curvedUV + vec2(u_time * 0.01, 0.0));
    color += (noise - 0.5) * NOISE_INTENSITY;
    
    // Apply vignette (darkening at the edges)
    float vignette = 1.0 - dot(curvedUV - 0.5, curvedUV - 0.5) * 2.0;
    vignette = pow(vignette, 1.5);
    color *= 1.0 - (1.0 - vignette) * VIGNETTE_INTENSITY;
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}