// Integration code for the textured shader scene with Three.js

import * as THREE from 'three';
import { getAudioController } from './audio-controller.js';

export class TexturedScene {
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
    
    // Load textures and create shader material
    this.loadTextures().then(() => {
      this.createShaderMaterial();
      this.createFullScreenQuad();
    });
    
    // Setup background music
    this.setupBackgroundMusic();
    
    // Add audio visualization
    this.setupAudioVisualization();
    
    // Listen for mute/unmute events
    this.setupMuteListener();
    
    // Start animation loop
    this.startTime = Date.now();
    this.animate();
    
    // Flag to track which shader is active
    this.useSimpleGlitch = true;
  }
  
  loadTextures() {
    // Create texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Load textures with promises
    const loadTexture = (path) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(
          path,
          (texture) => resolve(texture),
          undefined,
          (err) => {
            console.warn(`Failed to load texture: ${path}, using fallback`);
            // Create a fallback texture (colored pattern)
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            // Create a gradient pattern
            const gradient = ctx.createLinearGradient(0, 0, 256, 256);
            gradient.addColorStop(0, path.includes('texture1') ? '#ff00ff' : '#00ffff');
            gradient.addColorStop(1, path.includes('background') ? '#000033' : '#ffcc00');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 256, 256);
            
            // Add some pattern
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            for (let i = 0; i < 20; i++) {
              const x = Math.random() * 256;
              const y = Math.random() * 256;
              const size = 5 + Math.random() * 20;
              ctx.fillRect(x, y, size, size);
            }
            
            const fallbackTexture = new THREE.CanvasTexture(canvas);
            resolve(fallbackTexture);
          }
        );
      });
    };
    
    // Load all textures
    return Promise.all([
      loadTexture('assets/images/background.jpg'),
      loadTexture('assets/images/texture1.jpg'),
      loadTexture('assets/images/texture2.jpg')
    ]).then(textures => {
      [this.backgroundTexture, this.texture1, this.texture2] = textures;
      
      // Set texture properties
      this.textures = textures;
      this.textures.forEach(texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
      });
      
      console.log('Textures loaded successfully');
    }).catch(error => {
      console.error('Error loading textures:', error);
    });
  }
  
  createShaderMaterial() {
    // Load shader code
    Promise.all([
      fetch('textured_vertex.glsl').then(response => response.text()),
      fetch('textured_fragment.glsl').then(response => response.text()),
      fetch('simple_glitch_fragment.glsl').then(response => response.text())
    ]).then(([vertexShader, fragmentShader, simpleGlitchShader]) => {
      // Store shader code
      this.vertexShader = vertexShader;
      this.fragmentShader = fragmentShader;
      this.simpleGlitchShader = simpleGlitchShader;
      
      // Shader uniforms
      this.uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_audioLevel: { value: 0.0 },
        u_background: { value: this.backgroundTexture },
        u_texture1: { value: this.texture1 },
        u_texture2: { value: this.texture2 }
      };
      
      // Create shader material (start with simple glitch shader)
      this.createSimpleGlitchMaterial();
      
      // Apply material to the mesh if it exists
      if (this.mesh) {
        this.mesh.material = this.material;
      }
      
      // Set up shader toggle with key press
      window.addEventListener('keydown', (event) => {
        if (event.key === 'g' || event.key === 'G') {
          this.toggleShader();
        }
      });
      
      // Add info about shader toggle
      this.showShaderToggleInfo();
    }).catch(error => {
      console.error('Error loading shaders:', error);
      this.createFallbackMaterial();
    });
  }
  
  createSimpleGlitchMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.simpleGlitchShader
    });
    
    // Apply material to the mesh if it exists
    if (this.mesh) {
      this.mesh.material = this.material;
    }
    
    this.useSimpleGlitch = true;
  }
  
  createComplexMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader
    });
    
    // Apply material to the mesh if it exists
    if (this.mesh) {
      this.mesh.material = this.material;
    }
    
    this.useSimpleGlitch = false;
  }
  
  toggleShader() {
    if (this.useSimpleGlitch) {
      this.createComplexMaterial();
      console.log('Switched to complex shader');
    } else {
      this.createSimpleGlitchMaterial();
      console.log('Switched to simple glitch shader');
    }
  }
  
  showShaderToggleInfo() {
    // Create info element
    const infoElement = document.createElement('div');
    infoElement.style.position = 'absolute';
    infoElement.style.bottom = '80px';
    infoElement.style.left = '50%';
    infoElement.style.transform = 'translateX(-50%)';
    infoElement.style.padding = '10px 20px';
    infoElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    infoElement.style.color = '#00ffff';
    infoElement.style.fontFamily = '"VT323", "Courier New", monospace';
    infoElement.style.fontSize = '18px';
    infoElement.style.borderRadius = '5px';
    infoElement.style.zIndex = '1000';
    infoElement.textContent = 'Press G to toggle between shader effects';
    document.body.appendChild(infoElement);
    
    // Fade out after 5 seconds
    setTimeout(() => {
      infoElement.style.transition = 'opacity 1s';
      infoElement.style.opacity = '0';
      setTimeout(() => infoElement.remove(), 1000);
    }, 5000);
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
      uniform sampler2D u_texture1;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        float time = u_time * 0.5;
        
        // Simple distortion
        uv.x += sin(uv.y * 10.0 + time) * 0.02;
        uv.y += cos(uv.x * 10.0 + time * 0.7) * 0.02;
        
        // Sample texture
        vec4 color = texture2D(u_texture1, uv);
        
        // Add some color pulsing
        color.r += sin(time) * 0.1;
        color.b += cos(time * 1.3) * 0.1;
        
        gl_FragColor = color;
      }
    `;
    
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