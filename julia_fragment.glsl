// Julia set fractal fragment shader
precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform vec2 u_mouse;       // Mouse position in normalized coordinates (0.0 to 1.0)
uniform float u_audioLevel; // Audio level for reactivity

// Constants for the fractal
const int MAX_ITERATIONS = 100;
const float ESCAPE_RADIUS = 4.0;
const float ZOOM_BASE = 2.5;

// Function to map a value from one range to another
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// Function to calculate the Julia set
vec3 julia(vec2 coord, vec2 c) {
    // Initialize z to the current coordinate
    vec2 z = coord;
    
    // Iterate the Julia set formula: z = z^2 + c
    int iterations = 0;
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        // z^2 = (a+bi)^2 = a^2 - b^2 + 2abi
        float zr = z.x * z.x - z.y * z.y;
        float zi = 2.0 * z.x * z.y;
        
        // z = z^2 + c
        z.x = zr + c.x;
        z.y = zi + c.y;
        
        // Check if the point escapes
        if (dot(z, z) > ESCAPE_RADIUS) {
            break;
        }
        
        iterations++;
    }
    
    // Calculate smooth coloring based on iterations and escape value
    float smoothColor = float(iterations) - log2(log2(dot(z, z))) + 4.0;
    float normalized = smoothColor / float(MAX_ITERATIONS);
    
    // Create a color palette based on time and iterations
    float t = u_time * 0.1;
    vec3 color1 = 0.5 + 0.5 * cos(t + normalized * 6.28 + vec3(0.0, 0.6, 1.0));
    vec3 color2 = 0.5 + 0.5 * sin(t * 0.5 + normalized * 6.28 + vec3(0.4, 0.2, 0.6));
    
    // Mix colors based on audio level and time
    float mixFactor = sin(u_time * 0.2) * 0.5 + 0.5;
    mixFactor = mix(mixFactor, mixFactor * u_audioLevel * 2.0, 0.5);
    vec3 color = mix(color1, color2, mixFactor);
    
    // Adjust brightness based on audio level
    color *= 1.0 + u_audioLevel * 0.5;
    
    // Return black for points inside the set
    if (iterations == MAX_ITERATIONS) {
        return vec3(0.0);
    }
    
    return color;
}

void main() {
    // Get normalized pixel coordinates (-1 to 1)
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Calculate zoom based on time and audio level
    float zoom = ZOOM_BASE * (1.0 + sin(u_time * 0.05) * 0.2 + u_audioLevel * 0.3);
    uv /= zoom;
    
    // Calculate Julia set constant from mouse position
    // Map mouse from (0,0)-(1,1) to (-1,-1)-(1,1) with some additional variation
    vec2 c = vec2(
        map(u_mouse.x, 0.0, 1.0, -0.8, 0.8),
        map(u_mouse.y, 0.0, 1.0, -0.8, 0.8)
    );
    
    // Add some time-based movement when mouse isn't moving
    c += vec2(
        sin(u_time * 0.3) * 0.1,
        cos(u_time * 0.2) * 0.1
    ) * (1.0 - length(u_mouse - vec2(0.5)) * 2.0);
    
    // Calculate the fractal color
    vec3 color = julia(uv, c);
    
    // Add a subtle vignette effect
    float vignette = 1.0 - dot(uv / zoom, uv / zoom) * 0.5;
    color *= vignette;
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}