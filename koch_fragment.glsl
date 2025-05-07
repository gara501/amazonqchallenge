precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform vec2 u_mouse;       // Mouse position in normalized coordinates (0.0 to 1.0)
uniform float u_audioLevel; // Audio level for reactivity

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
    
    // Modify palette based on mouse position
    float mouseX = u_mouse.x;
    float mouseY = u_mouse.y;
    
    a = mix(vec3(0.5, 0.5, 0.5), vec3(0.2, 0.7, 0.9), mouseX);
    b = mix(vec3(0.5, 0.5, 0.5), vec3(0.9, 0.2, 0.5), mouseY);
    c = mix(vec3(1.0, 1.0, 1.0), vec3(0.7, 0.8, 0.2), mouseX * mouseY);
    
    // Calculate color using a sinusoidal pattern
    return a + b * cos(6.28318 * (c * t + d));
}

// Simple Koch curve using iteration and folding
vec2 fold(vec2 p) {
    // Fold along y = 0
    p.y = abs(p.y);
    
    // Fold along y = tan(60°) * x
    float k = p.y - 0.57735 * p.x; // tan(60°) ≈ 1.73205, 1/tan(60°) ≈ 0.57735
    if (k > 0.0) {
        float a = (0.5 * (p.y + 0.57735 * p.x));
        p = vec2(p.x - a, p.y - a * 1.73205);
    }
    
    return p;
}

void main() {
    // Get normalized pixel coordinates (-1 to 1)
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Scale based on mouse position and audio level
    float scale = map(u_mouse.x, 0.0, 1.0, 0.5, 2.0);
    float detail = map(u_mouse.y, 0.0, 1.0, 1.0, 5.0);
    
    // Apply zoom and rotation
    float zoom = 1.0 * scale;
    uv /= zoom; // Divide by zoom to zoom in
    
    // Rotate based on time
    float angle = u_time * 0.1;
    float c = cos(angle);
    float s = sin(angle);
    uv = mat2(c, -s, s, c) * uv;
    
    // Create Koch snowflake pattern
    vec2 p = uv;
    float d = 1000.0;
    
    // Create a hexagonal grid for multiple Koch snowflakes
    vec2 id = floor(p * 2.0);
    p = mod(p * 2.0, 1.0) - 0.5;
    
    // Apply Koch curve transformation
    float r = 0.4; // Base size
    
    // Apply iterative folding to create Koch-like pattern
    vec2 z = p;
    float scale_factor = 1.0;
    
    for (int i = 0; i < 5; i++) {
        if (float(i) >= detail) break;
        
        // Apply folding operations
        z = fold(z);
        
        // Scale and translate
        z = z * 3.0 - vec2(2.0, 0.0);
        
        // Update scale factor
        scale_factor *= 3.0;
    }
    
    // Calculate distance to the pattern
    float dist = length(z) / scale_factor;
    
    // Create multiple instances with rotation
    for (int i = 0; i < 6; i++) {
        float ang = float(i) * 3.14159 / 3.0;
        vec2 rot_p = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p;
        
        // Create a line
        float line = abs(rot_p.y) / zoom;
        
        // Apply Koch-like modulation
        float freq = 80.0 * pow(2.0, floor(detail));
        float amp = 0.02 / zoom;
        line -= amp * sin(rot_p.x * freq + u_time * 2.0);
        
        d = min(d, line);
    }
    
    // Add audio reactivity to the pattern
    d -= 0.01 * u_audioLevel;
    
    // Calculate color based on distance
    vec3 color;
    
    // Create a strong glow effect
    float glow = exp(-d * 20.0);
    color = palette(dist * 0.5 + u_time * 0.1) * glow;
    
    // Add audio reactivity to color
    color *= 1.0 + u_audioLevel * 0.5;
    
    // Add a subtle vignette effect
    float vignette = 1.0 - dot(uv * 0.5, uv * 0.5);
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;
    
    // Add a background color to ensure something is always visible
    vec3 bgColor = palette(u_time * 0.05) * 0.2;
    color = mix(bgColor, color, glow);
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}