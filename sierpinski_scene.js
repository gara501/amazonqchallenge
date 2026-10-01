// Integration code for the Sierpinski triangle fractal scene with Three.js

import * as THREE from 'three';
import { getAudioController } from './audio-controller.js';
import { initializePointerMotion, setPointerTarget, advancePointerMotion, removePointerListeners } from './pointer-motion.js?v=9';

export class SierpinskiScene {
  constructor() {
    // Create scene and camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    
    // The shader reads this vector; pointer events only move its target.
    this.mouse = new THREE.Vector2(0.5, 0.5);
    initializePointerMotion(this);
    
    // Create shader material
    this.createShaderMaterial();
    
    // Create a full-screen quad
    this.createFullScreenQuad();
    
    // Setup background music
    this.setupBackgroundMusic();
    
    // Add audio visualization
    this.setupAudioVisualization();
    
    // Listen for mute/unmute events
    this.setupMuteListener();
    
    // Add info text
    // The shared experience UI provides interaction guidance.
    
    // Start animation loop
    this.startTime = Date.now();
    this.animate();
  }
  
  createShaderMaterial() {
    // Load shader code
    Promise.all([
      fetch('sierpinski_vertex.glsl').then(response => response.text()),
      fetch('sierpinski_fragment.glsl?v=8').then(response => response.text())
    ]).then(([vertexShader, fragmentShader]) => {
      // Shader uniforms
      this.uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: this.mouse },
        u_audioLevel: { value: 0.0 }
      };
      
      // Create shader material
      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
      
      // Apply material to the mesh if it exists
      if (this.mesh) {
        this.mesh.material = this.material;
      }
    }).catch(error => {
      console.error('Error loading shaders:', error);
      this.createFallbackMaterial();
    });
  }
  
  createFallbackMaterial() {
    // Create a simple fallback shader if the main one fails to load
    const fallbackVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
    
    const fallbackFragmentShader = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float d = length(uv);
        
        vec3 color = 0.5 + 0.5 * cos(u_time + vUv.xyx * 6.28 + vec3(0, 2, 4));
        color *= 1.0 - d * 0.5;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    // Create uniforms
    this.uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: this.mouse }
    };
    
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: fallbackVertexShader,
      fragmentShader: fallbackFragmentShader
    });
    
    // Apply material to the mesh
    if (this.mesh) {
      this.mesh.material = this.material;
    }
  }
  
  createFullScreenQuad() {
    // Create a plane geometry that fills the screen
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Create a default material (will be replaced when shader loads)
    const defaultMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    // Create mesh
    this.mesh = new THREE.Mesh(geometry, this.material || defaultMaterial);
    this.scene.add(this.mesh);
  }
  
  setupBackgroundMusic() {
    // Create an audio element
    this.audioElement = document.createElement('audio');
    this.audioElement.src = 'assets/music2.mp3';
    this.audioElement.loop = true;
    
    // Add audio element to the DOM (not visible but needed for some browsers)
    this.audioElement.style.display = 'none';
    document.body.appendChild(this.audioElement);
    
    // Register with audio controller
    const audioController = getAudioController();
    
    // Start playing (will be subject to browser autoplay policies)
    this.audioElement.play().catch(error => {
      console.log("Audio autoplay was prevented:", error);
    });
  }
  
  setupAudioVisualization() {
    // Try to find the audio element
    if (this.audioElement) {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.warn('AudioContext not supported in this browser');
        return;
      }
      
      try {
        this.audioContext = new AudioContext();
        
        // Create analyzer
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        
        // Connect audio element to analyzer
        const source = this.audioContext.createMediaElementSource(this.audioElement);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        // Create data array for frequency data
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        
        // Register audio context with controller
        const audioController = getAudioController();
        if (audioController) {
          audioController.registerAudioContext(this.audioContext);
        }
        
        console.log('Audio visualization setup complete');
      } catch (e) {
        console.warn('Could not set up audio visualization:', e);
      }
    } else {
      console.log('No audio element found for visualization');
    }
  }
  
  setupMuteListener() {
    // Listen for mute/unmute events
    this.boundOnAudioMuteChanged = (event) => {
      const isMuted = event.detail.muted;
      
      // When muted, we'll still update the audio level uniform but with a very low value
      // This keeps the visualization running but at a minimal level
      if (isMuted) {
        this.audioMuted = true;
      } else {
        this.audioMuted = false;
      }
    };
    window.addEventListener('audio-mute-changed', this.boundOnAudioMuteChanged);
  }
  
  updateAudioLevel() {
    if (this.analyser && this.dataArray) {
      try {
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate average level
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
          sum += this.dataArray[i];
        }
        let avg = sum / this.dataArray.length / 255.0; // Normalize to 0-1
        
        // If audio is muted, reduce the level significantly but don't zero it completely
        // This keeps some minimal animation going
        if (this.audioMuted) {
          avg *= 0.05; // Reduce to 5% of original level when muted
        }
        
        // Update uniform with some smoothing
        if (this.uniforms && this.uniforms.u_audioLevel) {
          this.uniforms.u_audioLevel.value = this.uniforms.u_audioLevel.value * 0.85 + avg * 0.15;
        }

      } catch (e) {
        console.warn('Error updating audio level:', e);
      }
    }
  }
  
  updateFormulaValues() {
    // Update formula values if the formula controller exists
    if (window.formulaController && this.uniforms && this.uniforms.u_mouse) {
      const mouseX = this.uniforms.u_mouse.value.x;
      const mouseY = this.uniforms.u_mouse.value.y;
      
      // Find the formula value elements
      const scaleElement = document.getElementById('sierpinski-scale');
      const variationElement = document.getElementById('sierpinski-variation');
      
      if (scaleElement) {
        const scale = (1.55 + mouseX * 0.9).toFixed(2);
        scaleElement.textContent = scale;
      }
      
      if (variationElement) {
        const variation = (0.25 + mouseY * 2.25).toFixed(2);
        variationElement.textContent = variation;
      }
    }
  }
  
  onMouseMove(event) {
    setPointerTarget(this, event.clientX, event.clientY);
  }

  onTouchMove(event) {
    if (event.target.closest('.chapter-nav')) return;
    event.preventDefault();
    if (event.touches.length > 0) {
      setPointerTarget(this, event.touches[0].clientX, event.touches[0].clientY);
    }
  }

  removeEventListeners() {
    removePointerListeners(this);
  }
  
  addInfoText() {
    // Create info element
    const infoElement = document.createElement('div');
    infoElement.style.position = 'absolute';
    infoElement.style.bottom = '80px';
    infoElement.style.left = '50%';
    infoElement.style.transform = 'translateX(-50%)';
    infoElement.style.padding = '10px 20px';
    infoElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    infoElement.style.color = '#ffcc00';
    infoElement.style.fontFamily = '"VT323", "Courier New", monospace';
    infoElement.style.fontSize = '18px';
    infoElement.style.borderRadius = '5px';
    infoElement.style.zIndex = '1000';
    infoElement.textContent = 'Move mouse: X = scale, Y = variation';
    document.body.appendChild(infoElement);
    
    // Fade out after 5 seconds
    setTimeout(() => {
      infoElement.style.transition = 'opacity 1s';
      infoElement.style.opacity = '0';
      setTimeout(() => infoElement.remove(), 1000);
    }, 5000);
  }
  
  onWindowResize() {
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update resolution uniform
    if (this.uniforms && this.uniforms.u_resolution) {
      this.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    }
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    if (this.isFrozen) return;
    advancePointerMotion(this);
    this.updateFormulaValues();
    
    // Update time uniform
    if (this.uniforms && this.uniforms.u_time) {
      this.uniforms.u_time.value = (Date.now() - this.startTime) * 0.001; // Convert to seconds
    }
    
    // Update audio level
    this.updateAudioLevel();
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
}
