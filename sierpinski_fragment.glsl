// Sierpinski triangle fractal fragment shader
precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform vec2 u_mouse;       // Mouse position in normalized coordinates (0.0 to 1.0)
uniform float u_audioLevel; // Audio level for reactivity

// Constants for the fractal
const int MAX_ITERATIONS = 8;
const float ZOOM_BASE = 1.0;

// Function to map a value from one range to another
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// Function to calculate distance to the Sierpinski triangle
float sierpinski(vec2 p, float scale, float variation) {
    // Initialize distance
    float dist = 0.0;
    
    // Iterate to create the fractal
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        // Fold the space along the y-axis
        p.x = abs(p.x);
        
        // Rotate the space based on mouse position and time
        float angle = u_time * 0.1 * variation;
        float c = cos(angle);
        float s = sin(angle);
        p = mat2(c, -s, s, c) * p;
        
        // Apply the Sierpinski transformation
        if (p.x + p.y > 1.0) {
            p.xy = vec2(1.0) - p.yx;
        }
        
        // Scale and translate
        p = scale * p - vec2(scale - 1.0);
        
        // Accumulate distance
        dist = length(p);
    }
    
    return dist;
}

// Function to create a color palette
vec3 palette(float t) {
    // Create a color palette based on time and audio level
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.3, 0.2, 0.2);
    
    // Modify palette based on mouse position
    float mouseX = u_mouse.x;
    float mouseY = u_mouse.y;
    
    a = mix(vec3(0.5, 0.5, 0.5), vec3(0.2, 0.5, 0.8), mouseX);
    b = mix(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.2, 0.5), mouseY);
    c = mix(vec3(1.0, 1.0, 1.0), vec3(1.0, 0.8, 0.2), mouseX * mouseY);
    
    // Calculate color using a sinusoidal pattern
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    // Get normalized pixel coordinates (-1 to 1)
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Calculate zoom based on time and audio level
    float zoom = ZOOM_BASE * (1.0 + sin(u_time * 0.1) * 0.1 + u_audioLevel * 0.3);
    
    // Apply zoom
    uv *= zoom;
    
    // Calculate parameters based on mouse position
    float scale = map(u_mouse.x, 0.0, 1.0, 1.8, 2.2);
    float variation = map(u_mouse.y, 0.0, 1.0, 0.5, 2.0);
    
    // Add some time-based movement when mouse isn't moving
    vec2 offset = vec2(
        sin(u_time * 0.2) * 0.1,
        cos(u_time * 0.15) * 0.1
    ) * (1.0 - length(u_mouse - vec2(0.5)) * 2.0);
    
    // Apply offset to coordinates
    uv += offset;
    
    // Calculate the fractal
    float dist = sierpinski(uv, scale, variation);
    
    // Calculate color based on distance and time
    float t = dist * 0.5 + u_time * 0.1;
    vec3 color = palette(t);
    
    // Add audio reactivity
    color *= 1.0 + u_audioLevel * 0.5;
    
    // Add a subtle vignette effect
    float vignette = 1.0 - dot(uv * 0.5, uv * 0.5);
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}