precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_audioLevel;

const int SPONGE_LEVELS = 4;
const int MARCH_STEPS = 80;

float sdBox(vec3 p, vec3 halfSize) {
    vec3 q = abs(p) - halfSize;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// Begin with a bounded cube. At each scale, subtract the three
// intersecting tunnels that define a Menger sponge.
float mengerSponge(vec3 p, float scale) {
    float distanceToSponge = sdBox(p, vec3(1.0));
    float repeatScale = 1.0;

    for (int i = 0; i < SPONGE_LEVELS; i++) {
        vec3 cell = mod(p * repeatScale, 2.0) - 1.0;
        vec3 r = abs(1.0 - scale * abs(cell));
        float tunnels = min(max(r.x, r.y), min(max(r.y, r.z), max(r.z, r.x)));
        float cutDistance = (tunnels - 1.0) / (repeatScale * scale);
        distanceToSponge = max(distanceToSponge, cutDistance);
        repeatScale *= scale;
    }

    return distanceToSponge;
}

// Rotate the object in its own coordinate system. The camera rays keep
// pointing at the origin, so a full turn cannot move it out of view.
vec3 spongePoint(vec3 worldPoint, float variation) {
    float yaw = u_time * 0.16 * variation + (u_mouse.x - 0.5) * 1.5;
    float pitch = 0.22 * sin(u_time * 0.12) + (u_mouse.y - 0.5) * 0.76;
    float cy = cos(yaw);
    float sy = sin(yaw);
    float cp = cos(pitch);
    float sp = sin(pitch);
    worldPoint.xz = mat2(cy, -sy, sy, cy) * worldPoint.xz;
    worldPoint.yz = mat2(cp, -sp, sp, cp) * worldPoint.yz;
    return worldPoint;
}

float sceneDistance(vec3 worldPoint, float scale, float variation) {
    return mengerSponge(spongePoint(worldPoint, variation), scale);
}

vec3 palette(float t) {
    vec3 base = mix(vec3(0.17, 0.52, 0.64), vec3(0.98, 0.55, 0.44),
                    0.5 + 0.5 * sin(t * 4.0));
    return base;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    uv.y += 0.04;
    float scale = mix(2.65, 3.35, u_mouse.x);
    float variation = mix(0.5, 2.0, u_mouse.y);

    vec3 rayOrigin = vec3(0.0, 0.0, -7.2);
    vec3 rayDirection = normalize(vec3(uv * 1.1, 1.8));
    float travel = 0.0;
    float distanceToSurface = 0.0;
    bool hit = false;

    for (int i = 0; i < MARCH_STEPS; i++) {
        vec3 point = rayOrigin + rayDirection * travel;
        distanceToSurface = sceneDistance(point, scale, variation);
        if (distanceToSurface < 0.0015) {
            hit = true;
            break;
        }
        travel += max(distanceToSurface * 0.8, 0.003);
        if (travel > 12.0) break;
    }

    float halo = exp(-3.0 * dot(uv, uv));
    vec3 color = vec3(0.009, 0.017, 0.027) + vec3(0.015, 0.023, 0.032) * halo;

    if (hit) {
        vec3 point = rayOrigin + rayDirection * travel;
        float epsilon = 0.003;
        vec3 normal = normalize(vec3(
            sceneDistance(point + vec3(epsilon, 0.0, 0.0), scale, variation) - distanceToSurface,
            sceneDistance(point + vec3(0.0, epsilon, 0.0), scale, variation) - distanceToSurface,
            sceneDistance(point + vec3(0.0, 0.0, epsilon), scale, variation) - distanceToSurface
        ));
        float light = 0.38 + 0.62 * max(dot(normal, normalize(vec3(-0.5, 0.8, -0.6))), 0.0);
        float rim = pow(1.0 - max(dot(normal, -rayDirection), 0.0), 2.0);
        color = palette(travel * 0.14 + u_time * 0.03) * light;
        color += vec3(0.08, 0.12, 0.15) * rim;
        color *= 1.0 + u_audioLevel * 0.25;
    }

    gl_FragColor = vec4(color, 1.0);
}
