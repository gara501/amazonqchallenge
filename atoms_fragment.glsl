precision highp float;

// Uniforms passed from the application
uniform float u_time;       // Time in seconds
uniform vec2 u_resolution;  // Canvas resolution (width, height)
uniform vec2 u_mouse;       // Mouse position in normalized coordinates (0.0 to 1.0)
uniform float u_audioLevel; // Audio level for reactivity

// Constants for the simulation
const int MAX_PARTICLES = 50;
const float PARTICLE_SIZE = 0.01;
const float ELECTRON_SPEED = 2.0;

// Function to map a value from one range to another
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// Hash function for pseudo-random numbers
float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

// 2D hash function
vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

// Function to create a soft circle
float softCircle(vec2 uv, vec2 center, float radius, float softness) {
    float dist = length(uv - center);
    return 1.0 - smoothstep(radius - softness, radius, dist);
}

// Function to create a glowing circle
vec3 glowingCircle(vec2 uv, vec2 center, float radius, vec3 color, float glow) {
    float dist = length(uv - center);
    float brightness = exp(-dist * glow);
    return color * brightness;
}

// Function to create an electron orbit
vec2 electronPosition(vec2 center, float radius, float angle, float eccentricity) {
    // Elliptical orbit
    float x = center.x + radius * (1.0 + eccentricity * sin(angle * 2.0)) * cos(angle);
    float y = center.y + radius * (1.0 - eccentricity * cos(angle * 3.0)) * sin(angle);
    return vec2(x, y);
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
    c = mix(vec3(1.0, 1.0, 1.0), vec3(0.7, 0.8, 0.2), mouseX * mouseY);
    
    // Calculate color using a sinusoidal pattern
    return a + b * cos(6.28318 * (c * t + d));
}

// Function to create an atom with nucleus and electrons
vec3 createAtom(vec2 uv, vec2 center, float size, vec3 color, float time, int electrons, float eccentricity) {
    // Create the nucleus
    float nucleusRadius = size * 0.2;
    float nucleusGlow = 10.0 + 5.0 * sin(time * 0.5);
    vec3 nucleusColor = color;
    
    // Add some audio reactivity to the nucleus
    nucleusRadius *= 1.0 + u_audioLevel * 0.2;
    nucleusGlow += u_audioLevel * 5.0;
    
    // Calculate nucleus
    vec3 atom = glowingCircle(uv, center, nucleusRadius, nucleusColor, nucleusGlow);
    
    // Add electrons
    for (int i = 0; i < MAX_PARTICLES; i++) {
        if (i >= electrons) break;
        
        // Calculate electron properties
        float orbitRadius = size * (0.4 + 0.2 * float(i) / float(electrons));
        float speed = ELECTRON_SPEED * (1.0 - 0.1 * float(i) / float(electrons));
        float angle = time * speed + float(i) * 6.28318 / float(electrons);
        
        // Calculate electron position
        vec2 electronPos = electronPosition(center, orbitRadius, angle, eccentricity);
        
        // Draw electron
        float electronSize = size * 0.05;
        float electronGlow = 15.0;
        vec3 electronColor = palette(float(i) / float(electrons) + time * 0.1);
        
        // Add electron to the atom
        atom += glowingCircle(uv, electronPos, electronSize, electronColor, electronGlow);
        
        // Add orbit trail
        float trailIntensity = 0.1 + 0.1 * sin(time + float(i));
        for (int j = 1; j <= 5; j++) {
            float trailAngle = angle - float(j) * 0.1;
            vec2 trailPos = electronPosition(center, orbitRadius, trailAngle, eccentricity);
            float trailSize = electronSize * (1.0 - float(j) * 0.15);
            float trailGlow = electronGlow * (1.0 - float(j) * 0.15);
            
            atom += glowingCircle(uv, trailPos, trailSize, electronColor, trailGlow) * trailIntensity;
        }
    }
    
    return atom;
}

// Function to create a quantum field effect
vec3 quantumField(vec2 uv, float time) {
    vec3 field = vec3(0.0);
    
    // Create a subtle background field
    for (int i = 0; i < 10; i++) {
        vec2 pos = vec2(
            hash(float(i) * 0.123 + time * 0.1),
            hash(float(i) * 0.567 + time * 0.05)
        );
        
        float size = 0.2 + 0.1 * hash(float(i) * 0.789);
        vec3 color = palette(hash(float(i)) + time * 0.05);
        float intensity = 0.02 + 0.01 * sin(time + float(i));
        
        field += glowingCircle(uv, pos, size, color, 2.0) * intensity;
    }
    
    return field;
}

void main() {
    // Get normalized pixel coordinates (-1 to 1)
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Mouse parameters
    float mouseX = u_mouse.x;
    float mouseY = u_mouse.y;
    
    // Number of atoms based on mouse Y position
    int numAtoms = int(mix(3.0, 8.0, mouseY));
    
    // Atom parameters based on mouse position
    float atomSize = mix(0.2, 0.4, mouseX);
    int electrons = int(mix(2.0, 8.0, mouseY));
    float eccentricity = mix(0.0, 0.3, mouseX);
    
    // Create quantum field background
    vec3 color = quantumField(uv, u_time);
    
    // Create atoms
    for (int i = 0; i < MAX_PARTICLES; i++) {
        if (i >= numAtoms) break;
        
        // Calculate atom position
        float angle = float(i) * 6.28318 / float(numAtoms) + u_time * 0.1;
        float radius = 0.5 + 0.2 * sin(u_time * 0.2 + float(i));
        vec2 center = vec2(
            radius * cos(angle),
            radius * sin(angle)
        );
        
        // Add audio reactivity to position
        center += vec2(cos(u_time + float(i)), sin(u_time * 0.7 + float(i))) * u_audioLevel * 0.2;
        
        // Calculate atom color
        vec3 atomColor = palette(float(i) / float(numAtoms) + u_time * 0.1);
        
        // Create atom
        color += createAtom(uv, center, atomSize, atomColor, u_time, electrons, eccentricity);
    }
    
    // Add central atom
    vec3 centralAtomColor = vec3(1.0, 1.0, 1.0);
    color += createAtom(uv, vec2(0.0, 0.0), atomSize * 1.5, centralAtomColor, u_time, electrons + 2, eccentricity * 0.5);
    
    // Add vignette effect
    float vignette = 1.0 - dot(uv * 0.5, uv * 0.5);
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;
    
    // Add subtle glow based on audio level
    color += vec3(0.1, 0.2, 0.3) * u_audioLevel;
    
    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}