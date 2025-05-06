// Newton-Raphson fractal fragment shader
precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform vec2 u_mouse;       // Mouse position in normalized coordinates (0.0 to 1.0)
uniform float u_audioLevel; // Audio level for reactivity

// Constants for the fractal
const int MAX_ITERATIONS = 20;
const float EPSILON = 0.0001;
const float ZOOM_BASE = 1.5;

// Complex number operations
vec2 complex_mul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 complex_div(vec2 a, vec2 b) {
    float denom = b.x * b.x + b.y * b.y;
    return vec2(
        (a.x * b.x + a.y * b.y) / denom,
        (a.y * b.x - a.x * b.y) / denom
    );
}

vec2 complex_pow(vec2 z, int n) {
    vec2 result = vec2(1.0, 0.0); // 1 + 0i
    for (int i = 0; i < 10; i++) { // Limit to avoid infinite loops
        if (i >= n) break;
        result = complex_mul(result, z);
    }
    return result;
}

// Function to map a value from one range to another
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// Newton-Raphson iteration for f(z) = z^n - 1
vec2 newton_iteration(vec2 z, int n, float relaxation) {
    // f(z) = z^n - 1
    vec2 zn = complex_pow(z, n);
    vec2 f = vec2(zn.x - 1.0, zn.y);
    
    // f'(z) = n * z^(n-1)
    vec2 df = complex_mul(vec2(float(n), 0.0), complex_pow(z, n-1));
    
    // z = z - relaxation * f(z) / f'(z)
    return z - relaxation * complex_div(f, df);
}

// Function to calculate the Newton-Raphson fractal
vec3 newton_fractal(vec2 coord, int degree, float relaxation) {
    vec2 z = coord;
    
    // Define the roots of unity for z^n - 1 = 0
    vec2 roots[6]; // We'll support up to degree 6
    for (int i = 0; i < 6; i++) {
        if (i >= degree) break;
        float angle = 2.0 * 3.14159265359 * float(i) / float(degree);
        roots[i] = vec2(cos(angle), sin(angle));
    }
    
    // Iterate using Newton-Raphson method
    int iterations = 0;
    int root_index = -1;
    
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        z = newton_iteration(z, degree, relaxation);
        
        // Check if we're close to any root
        for (int j = 0; j < 6; j++) {
            if (j >= degree) break;
            if (length(z - roots[j]) < EPSILON) {
                root_index = j;
                iterations = i;
                break;
            }
        }
        
        if (root_index >= 0) break;
        iterations++;
    }
    
    // Calculate color based on which root we converged to and how quickly
    float t = u_time * 0.1;
    vec3 colors[6];
    colors[0] = vec3(1.0, 0.0, 0.0); // Red
    colors[1] = vec3(0.0, 1.0, 0.0); // Green
    colors[2] = vec3(0.0, 0.0, 1.0); // Blue
    colors[3] = vec3(1.0, 1.0, 0.0); // Yellow
    colors[4] = vec3(0.0, 1.0, 1.0); // Cyan
    colors[5] = vec3(1.0, 0.0, 1.0); // Magenta
    
    // Rotate colors over time
    int color_offset = int(t * 2.0) % degree;
    
    // If we didn't converge to any root
    if (root_index < 0) {
        return vec3(0.0); // Black
    }
    
    // Get the base color for this root
    int color_index = (root_index + color_offset) % degree;
    vec3 color = colors[color_index];
    
    // Adjust brightness based on iteration count
    float brightness = 1.0 - float(iterations) / float(MAX_ITERATIONS);
    brightness = pow(brightness, 0.5); // Gamma correction for better contrast
    
    // Add some variation based on audio level
    float audio_effect = 1.0 + u_audioLevel * 0.5;
    brightness *= audio_effect;
    
    // Add some subtle pulsing
    brightness *= 0.8 + 0.2 * sin(t * 5.0 + float(root_index));
    
    return color * brightness;
}

void main() {
    // Get normalized pixel coordinates (-1 to 1)
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Calculate zoom based on time and audio level
    float zoom = ZOOM_BASE * (1.0 + sin(u_time * 0.05) * 0.1 + u_audioLevel * 0.3);
    
    // Apply zoom
    uv /= zoom;
    
    // Calculate parameters based on mouse position
    // Map mouse from (0,0)-(1,1) to parameter ranges
    int degree = int(map(u_mouse.x, 0.0, 1.0, 3.0, 6.9)); // 3 to 6
    float relaxation = map(u_mouse.y, 0.0, 1.0, 0.5, 1.5); // 0.5 to 1.5
    
    // Add some time-based movement when mouse isn't moving
    vec2 offset = vec2(
        sin(u_time * 0.2) * 0.1,
        cos(u_time * 0.15) * 0.1
    ) * (1.0 - length(u_mouse - vec2(0.5)) * 2.0);
    
    // Apply offset to coordinates
    uv += offset;
    
    // Calculate the fractal color
    vec3 color = newton_fractal(uv, degree, relaxation);
    
    // Add a subtle vignette effect
    float vignette = 1.0 - dot(uv * zoom * 0.5, uv * zoom * 0.5);
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}