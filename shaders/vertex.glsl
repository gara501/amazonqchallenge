// Basic vertex shader for a fullscreen plane
attribute vec3 position;

void main() {
    // Pass the vertex position directly to gl_Position
    // The position is expected to be in clip space already (-1 to 1 range)
    gl_Position = vec4(position, 1.0);
}
