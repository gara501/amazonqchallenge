varying vec2 vUv;

void main() {
    // Pass UV coordinates to fragment shader
    vUv = uv;
    
    // Set vertex position
    gl_Position = vec4(position, 1.0);
}