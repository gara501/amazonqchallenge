// Keep the shader uniform and the displayed formula on the same, smoothly moving pointer.
export function initializePointerMotion(scene) {
  scene.targetMouse = scene.mouse.clone();
  scene.lastPointerFrame = performance.now();
  scene.boundOnWindowResize = scene.onWindowResize.bind(scene);
  scene.boundOnMouseMove = scene.onMouseMove.bind(scene);
  scene.boundOnTouchMove = scene.onTouchMove.bind(scene);
  window.addEventListener('resize', scene.boundOnWindowResize);
  window.addEventListener('mousemove', scene.boundOnMouseMove);
  window.addEventListener('touchmove', scene.boundOnTouchMove, { passive: false });
}

export function setPointerTarget(scene, clientX, clientY) {
  if (scene.isFrozen) return;
  scene.targetMouse.set(
    Math.min(1, Math.max(0, clientX / window.innerWidth)),
    Math.min(1, Math.max(0, 1 - clientY / window.innerHeight))
  );
}

export function advancePointerMotion(scene) {
  const now = performance.now();
  const delta = Math.min(0.05, Math.max(0, (now - scene.lastPointerFrame) / 1000));
  scene.lastPointerFrame = now;
  // Time-based damping feels consistent on both fast and slow displays.
  scene.mouse.lerp(scene.targetMouse, 1 - Math.exp(-13 * delta));
}

export function removePointerListeners(scene) {
  window.removeEventListener('resize', scene.boundOnWindowResize);
  window.removeEventListener('mousemove', scene.boundOnMouseMove);
  window.removeEventListener('touchmove', scene.boundOnTouchMove);
  if (scene.boundOnAudioMuteChanged) {
    window.removeEventListener('audio-mute-changed', scene.boundOnAudioMuteChanged);
  }
}
