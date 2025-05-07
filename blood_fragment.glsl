precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform vec2 u_mouse;       // Mouse position in normalized coordinates (0.0 to 1.0)
uniform float u_audioLevel; // Audio level for reactivity

// Constants for the fractal
const int MAX_ITERATIONS = 100;
const float EPSILON = 0.0001;

// Function to map a value from one range to another
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// Function to create a color palette
vec3 palette(float t) {
    // Create a color palette based on time and audio level
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.3, 0.2, 0.2);
    
    // Modify palette based on mouse position - blood-like colors
    float mouseX = u_mouse.x;
    float mouseY = u_mouse.y;
    
    a = mix(vec3(0.5, 0.0, 0.0), vec3(0.8, 0.1, 0.1), mouseX);
    b = mix(vec3(0.5, 0.0, 0.0), vec3(0.2, 0.0, 0.0), mouseY);
    c = mix(vec3(1.0, 0.3, 0.3), vec3(0.7, 0.0, 0.0), mouseX * mouseY);
    
    // Calculate color using a sinusoidal pattern
    return a + b * cos(6.28318 * (c * t + d));
}

// Blood vessel simulation using domain warping and noise
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    // Mix 4 corners
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // Mouse controls the level of detail and scale
    int octaves = int(mix(2.0, 6.0, u_mouse.y));
    float lacunarity = mix(1.5, 3.0, u_mouse.x);
    
    for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        
        value += amplitude * noise(p * frequency);
        frequency *= lacunarity;
        amplitude *= 0.5;
    }
    
    return value;
}

// Blood vessel pattern using domain warping
float bloodVessels(vec2 p) {
    // First layer of domain warping
    vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0) + 0.1 * u_time),
        fbm(p + vec2(5.2, 1.3) - 0.1 * u_time)
    );
    
    // Second layer of domain warping
    vec2 r = vec2(
        fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * u_time),
        fbm(p + 4.0 * q + vec2(8.3, 2.8) - 0.15 * u_time)
    );
    
    // Final pattern
    float f = fbm(p + 4.0 * r);
    
    // Add some audio reactivity
    f += 0.2 * u_audioLevel * sin(p.x * 10.0 + u_time) * sin(p.y * 10.0 + u_time);
    
    return f;
}

// Function to create blood vessel network
float bloodVesselNetwork(vec2 p) {
    // Scale based on mouse position
    float scale = mix(2.0, 5.0, u_mouse.x);
    p *= scale;
    
    // Get base pattern
    float pattern = bloodVessels(p);
    
    // Create vessel-like structures
    float vessels = smoothstep(0.4, 0.6, pattern);
    
    // Add smaller vessels
    vessels += 0.5 * smoothstep(0.6, 0.7, pattern);
    
    // Add even smaller capillaries
    vessels += 0.25 * smoothstep(0.7, 0.8, pattern);
    
    // Pulsing effect based on time and audio
    float pulse = 0.05 * sin(u_time * 2.0) * (1.0 + u_audioLevel);
    vessels += pulse;
    
    return vessels;
}

void main() {
    // Get normalized pixel coordinates (-1 to 1)
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Apply zoom and rotation
    float zoom = 1.0 + 0.5 * sin(u_time * 0.1) + 0.5 * u_audioLevel;
    uv /= zoom;
    
    // Rotate based on time
    float angle = u_time * 0.05;
    float c = cos(angle);
    float s = sin(angle);
    uv = mat2(c, -s, s, c) * uv;
    
    // Calculate blood vessel pattern
    float pattern = bloodVesselNetwork(uv);
    
    // Create color gradient based on pattern
    vec3 baseColor = palette(pattern + u_time * 0.1);
    
    // Darken areas for vessel-like appearance
    float vesselMask = smoothstep(0.4, 0.6, pattern);
    vec3 vesselColor = vec3(0.8, 0.0, 0.0) * (0.5 + 0.5 * sin(u_time + uv.x * 10.0));
    
    // Mix colors based on pattern
    vec3 color = mix(baseColor, vesselColor, vesselMask);
    
    // Add pulsing glow effect
    float pulse = 0.5 + 0.5 * sin(u_time * 2.0);
    color += vec3(0.2, 0.0, 0.0) * pulse * u_audioLevel;
    
    // Add vignette effect
    float vignette = 1.0 - dot(uv * 0.5, uv * 0.5);
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}