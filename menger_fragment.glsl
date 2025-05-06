precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform vec2 u_mouse;       // Mouse position in normalized coordinates (0.0 to 1.0)
uniform float u_audioLevel; // Audio level for reactivity

// Constants for the fractal
const int MAX_ITERATIONS = 12;
const float ZOOM_BASE = 1.5;

// Function to map a value from one range to another
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// Distance function for a Menger sponge
float mengerSponge(vec3 p, float scale, float variation) {
    float d = 1000.0;
    
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        // Fold space
        p = abs(p);
        
        // Rotation based on mouse and time
        float angle = u_time * 0.1 * variation;
        float c = cos(angle);
        float s = sin(angle);
        p.xz = mat2(c, -s, s, c) * p.xz;
        
        // Apply the Menger sponge transformation
        if (p.x < p.y) p.xy = p.yx;
        if (p.x < p.z) p.xz = p.zx;
        if (p.y < p.z) p.yz = p.zy;
        
        // Scale and translate
        p = scale * p - vec3(scale - 1.0);
        
        // Apply variation based on mouse position
        p.z += sin(u_time * 0.2) * 0.1 * variation;
    }
    
    return length(p) * pow(scale, -float(MAX_ITERATIONS));
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
    float scale = map(u_mouse.x, 0.0, 1.0, 2.8, 3.2);
    float variation = map(u_mouse.y, 0.0, 1.0, 0.5, 2.0);
    
    // Create a ray for the 3D fractal
    vec3 ro = vec3(0.0, 0.0, -2.0); // Ray origin
    vec3 rd = normalize(vec3(uv, 1.0)); // Ray direction
    
    // Rotate the ray based on time
    float angle = u_time * 0.2;
    float c = cos(angle);
    float s = sin(angle);
    rd.xz = mat2(c, -s, s, c) * rd.xz;
    
    // Ray marching parameters
    float t = 0.0;
    float d = 0.0;
    
    // Ray marching loop
    for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        d = mengerSponge(p, scale, variation);
        t += d * 0.5;
        if (d < 0.001 || t > 10.0) break;
    }
    
    // Calculate color based on distance and iterations
    vec3 color;
    if (d < 0.01) {
        float depth = t * 0.2;
        color = palette(depth + u_time * 0.1);
        
        // Add audio reactivity
        color *= 1.0 + u_audioLevel * 0.5;
    } else {
        color = vec3(0.0); // Background color
    }
    
    // Add a subtle vignette effect
    float vignette = 1.0 - dot(uv * 0.5, uv * 0.5);
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}