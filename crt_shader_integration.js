// Integration code for the CRT psychedelic shader with Three.js

import * as THREE from 'three';
import { getAudioController } from './audio-controller.js';

export class CRTPsychedelicEffect {
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
    
    // Add audio visualization if music is playing
    this.setupAudioVisualization();
    
    // Listen for mute/unmute events
    this.setupMuteListener();
    
    // Start animation loop
    this.startTime = Date.now();
    this.animate();
  }
  
  createShaderMaterial() {
    // Shader uniforms
    this.uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_audioLevel: { value: 0.0 } // For audio reactivity
    };
    
    // Load shader code
    fetch('psychedelic_crt_fragment.glsl')
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
      .catch(error => {
        console.error('Error loading shader:', error);
        // Create a fallback material if shader loading fails
        this.createFallbackMaterial();
      });
  }
  
  createFallbackMaterial() {
    // Create a simple fallback shader if the main one fails to load
    const fallbackFragmentShader = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
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
    window.addEventListener('audio-mute-changed', (event) => {
      const isMuted = event.detail.muted;
      
      // When muted, we'll still update the audio level uniform but with a very low value
      // This keeps the visualization running but at a minimal level
      if (isMuted) {
        this.audioMuted = true;
      } else {
        this.audioMuted = false;
      }
    });
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
    
    // Update audio level
    this.updateAudioLevel();
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
}