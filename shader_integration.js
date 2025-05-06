// Integration code for the psychedelic shader with Three.js

import * as THREE from 'three';
import { getAudioController } from './audio-controller.js';

export class PsychedelicEffect {
  constructor() {
    // Create scene and camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Create shader material
    this.createShaderMaterial();
    
    // Create a full-screen quad
    this.createFullScreenQuad();
    
    // Setup background music
    this.setupBackgroundMusic();
    
    // Start animation loop
    this.startTime = Date.now();
    this.animate();
  }
  
  createShaderMaterial() {
    // Shader uniforms
    this.uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };
    
    // Load shader code
    fetch('psychedelic_fragment.glsl')
      .then(response => response.text())
      .then(fragmentShader => {
        // Create shader material
        this.material = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: `
            // Basic vertex shader for a fullscreen plane
            varying vec2 vUv;
            
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 1.0);
            }
          `,
          fragmentShader: fragmentShader
        });
        
        // Apply material to the mesh
        if (this.mesh) {
          this.mesh.material = this.material;
        }
      })
      .catch(error => console.error('Error loading shader:', error));
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
    this.audioElement.src = 'assets/music.mp3';
    this.audioElement.loop = true;
    
    // Add audio element to the DOM (not visible but needed for some browsers)
    this.audioElement.style.display = 'none';
    document.body.appendChild(this.audioElement);
    
    // Register with audio controller
    const audioController = getAudioController();
    
    // Handle autoplay restrictions
    this.setupAutoplay();
  }
  
  setupAutoplay() {
    // Most browsers require user interaction before playing audio
    // Create a UI element to inform the user and handle interaction
    const audioPrompt = document.createElement('div');
    audioPrompt.style.position = 'absolute';
    audioPrompt.style.top = '20px';
    audioPrompt.style.left = '50%';
    audioPrompt.style.transform = 'translateX(-50%)';
    audioPrompt.style.padding = '10px 20px';
    audioPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    audioPrompt.style.color = 'white';
    audioPrompt.style.borderRadius = '5px';
    audioPrompt.style.cursor = 'pointer';
    audioPrompt.style.zIndex = '1000';
    audioPrompt.textContent = 'Click to enable audio';
    document.body.appendChild(audioPrompt);
    
    // Try to play automatically (might work in some cases)
    const playPromise = this.audioElement.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay started successfully
        audioPrompt.textContent = 'Audio playing';
        setTimeout(() => {
          audioPrompt.style.opacity = '0';
          audioPrompt.style.transition = 'opacity 1s';
          // Remove the element after fade out
          setTimeout(() => audioPrompt.remove(), 1000);
        }, 2000);
      }).catch(error => {
        // Autoplay was prevented
        console.log("Audio autoplay was prevented:", error);
        
        // Add click event to start audio on user interaction
        const startAudio = () => {
          this.audioElement.play()
            .then(() => {
              audioPrompt.textContent = 'Audio playing';
              setTimeout(() => {
                audioPrompt.style.opacity = '0';
                audioPrompt.style.transition = 'opacity 1s';
                // Remove the element after fade out
                setTimeout(() => audioPrompt.remove(), 1000);
              }, 2000);
            })
            .catch(e => console.error("Error playing audio:", e));
        };
        
        // Listen for click on the prompt
        audioPrompt.addEventListener('click', startAudio);
        
        // Also listen for any click on the document as a fallback
        const documentClickHandler = () => {
          startAudio();
          document.removeEventListener('click', documentClickHandler);
        };
        document.addEventListener('click', documentClickHandler);
      });
    }
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
    
    // Update time uniform
    if (this.uniforms && this.uniforms.u_time) {
      this.uniforms.u_time.value = (Date.now() - this.startTime) * 0.001; // Convert to seconds
    }
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
}