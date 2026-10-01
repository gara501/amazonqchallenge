import { chapters } from './lateral-menu.js?v=9';
import { fractalFacts } from './fractal-facts.js?v=1';

class ExperienceTools {
  constructor() {
    this.freezeButton = document.getElementById('freeze-button');
    this.saveButton = document.getElementById('save-button');
    this.readingButton = document.getElementById('reading-button');
    this.readingPanel = document.getElementById('symbolic-panel');
    this.readingCard = document.getElementById('reading-card');
    this.readingFront = document.getElementById('reading-front');
    this.readingBack = document.getElementById('reading-back');
    this.frozenScene = null;
    this.frozenImage = null;
    this.downloadUrl = null;
    this.sceneNumber = 1;

    this.freezeButton.addEventListener('click', () => this.toggleFreeze());
    this.saveButton.addEventListener('click', () => this.saveFrame());
    this.readingButton.addEventListener('click', () => this.toggleReading());
    document.getElementById('reading-close').addEventListener('click', () => this.closeReading());
    document.getElementById('reading-close-back').addEventListener('click', () => this.closeReading());
    document.getElementById('flip-to-math').addEventListener('click', () => this.flipReading(true));
    document.getElementById('flip-to-poetry').addEventListener('click', () => this.flipReading(false));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') this.closeReading();
    });
    window.addEventListener('scene-changed', event => this.changeScene(event.detail.sceneNumber));
    this.changeScene(1);
  }

  changeScene(sceneNumber) {
    this.releaseFrame();
    this.closeReading();
    this.sceneNumber = sceneNumber;
    const chapter = chapters[sceneNumber - 1];
    const fact = fractalFacts[chapter?.type];
    this.readingButton.hidden = !(chapter?.reading && fact);
    if (chapter?.reading && fact) {
      document.getElementById('symbolic-title').textContent = chapter.symbol;
      document.getElementById('symbolic-text').textContent = chapter.reading;
      document.getElementById('math-title').textContent = chapter.name;
      document.getElementById('math-formula').textContent = fact.formula;
      document.getElementById('math-explanation').textContent = fact.explanation;
      document.getElementById('math-discovery').textContent = fact.discovery;
      document.getElementById('math-source').href = fact.source;
    }
  }

  toggleFreeze() {
    if (this.frozenScene) {
      this.releaseFrame();
      return;
    }

    const scene = window.demoEffect;
    if (!scene?.renderer?.domElement || !scene.scene || !scene.camera) return;

    scene.isFrozen = true;
    scene.frozenAt = Date.now();
    if (scene.controls) scene.controls.enabled = false;

    try {
      // Read the WebGL buffer immediately after drawing, before the browser clears it.
      scene.renderer.render(scene.scene, scene.camera);
      const frame = scene.renderer.domElement.toDataURL('image/png');
      const encoded = frame.split(',')[1];
      if (!encoded) throw new Error('El lienzo todavía no está listo para capturar.');
      const binary = atob(encoded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      this.downloadUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
      this.frozenScene = scene;
      this.frozenImage = document.createElement('img');
      this.frozenImage.className = 'frozen-frame';
      this.frozenImage.alt = '';
      this.frozenImage.setAttribute('aria-hidden', 'true');
      this.frozenImage.src = this.downloadUrl;
      document.body.appendChild(this.frozenImage);
      document.body.classList.add('is-frozen');
      this.freezeButton.innerHTML = '<span aria-hidden="true">↻</span> REANUDAR';
      this.freezeButton.setAttribute('aria-pressed', 'true');
      this.saveButton.hidden = false;
      document.querySelector('.header-live').innerHTML = '<span></span> EN PAUSA';
    } catch (error) {
      console.error('No se pudo congelar el instante:', error);
      scene.isFrozen = false;
      if (scene.controls) scene.controls.enabled = true;
      if (this.downloadUrl) URL.revokeObjectURL(this.downloadUrl);
      this.downloadUrl = null;
    }
  }

  releaseFrame() {
    if (this.frozenScene) {
      const scene = this.frozenScene;
      const pausedFor = Date.now() - scene.frozenAt;
      if (typeof scene.startTime === 'number') scene.startTime += pausedFor;
      scene.animationPauseMs = (scene.animationPauseMs || 0) + pausedFor;
      scene.isFrozen = false;
      if (scene.controls) scene.controls.enabled = true;
    }
    this.frozenScene = null;
    if (this.downloadUrl) {
      const oldUrl = this.downloadUrl;
      setTimeout(() => URL.revokeObjectURL(oldUrl), 1500);
    }
    this.downloadUrl = null;
    this.frozenImage?.remove();
    this.frozenImage = null;
    document.body.classList.remove('is-frozen');
    this.freezeButton.innerHTML = '<span aria-hidden="true">◉</span> CONGELAR INSTANTE';
    this.freezeButton.setAttribute('aria-pressed', 'false');
    this.saveButton.hidden = true;
    document.querySelector('.header-live').innerHTML = '<span></span> EN VIVO';
  }

  saveFrame() {
    if (!this.downloadUrl) return;
    const chapter = chapters[this.sceneNumber - 1];
    const link = document.createElement('a');
    link.href = this.downloadUrl;
    link.download = `fractal-${chapter.type}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  toggleReading() {
    if (this.readingPanel.hidden) {
      this.flipReading(false, false);
      this.readingPanel.hidden = false;
      this.readingButton.setAttribute('aria-expanded', 'true');
      document.body.classList.add('reading-open');
      document.getElementById('flip-to-math').focus();
    } else {
      this.closeReading();
    }
  }

  flipReading(showMath, moveFocus = true) {
    this.readingCard.classList.toggle('is-flipped', showMath);
    this.readingFront.inert = showMath;
    this.readingBack.inert = !showMath;
    this.readingFront.setAttribute('aria-hidden', String(showMath));
    this.readingBack.setAttribute('aria-hidden', String(!showMath));
    if (moveFocus) document.getElementById(showMath ? 'flip-to-poetry' : 'flip-to-math').focus();
  }

  closeReading() {
    const wasOpen = !this.readingPanel.hidden;
    const hadFocus = this.readingPanel.contains(document.activeElement);
    this.readingPanel.hidden = true;
    this.readingButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('reading-open');
    this.flipReading(false, false);
    if (wasOpen && hadFocus) this.readingButton.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.experienceTools = new ExperienceTools();
});
