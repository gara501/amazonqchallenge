// atoms_scene.js - Integration code for the atoms simulation scene with Three.js

import * as THREE from 'three';
import { getAudioController } from './audio-controller.js';

export class AtomsScene {
  constructor() {
    // Create scene and camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    
    // Initialize mouse position
    this.mouse = new THREE.Vector2(0.5, 0.5);
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Handle mouse movement
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Handle touch movement for mobile devices
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    
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
    this.addInfoText();
    
    // Add philosophical quote (only for scene 9)
    this.addPhilosophicalQuote();
    
    // Start animation loop
    this.startTime = Date.now();
    this.animate();
  }
  
  createShaderMaterial() {
    // Load shader code
    Promise.all([
      fetch('atoms_vertex.glsl').then(response => response.text()),
      fetch('atoms_fragment.glsl').then(response => response.text())
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
    const defaultMaterial = new THREE.MeshBasicMaterial({ color: 0x000033 });
    
    // Create mesh
    this.mesh = new THREE.Mesh(geometry, this.material || defaultMaterial);
    this.scene.add(this.mesh);
  }
  
  setupBackgroundMusic() {
    // Create an audio element
    this.audioElement = document.createElement('audio');
    this.audioElement.src = 'assets/music9.mp3';
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
        
        // Update formula values
        this.updateFormulaValues();
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
      const atomSizeElement = document.getElementById('atom-size');
      const electronsElement = document.getElementById('atom-electrons');
      
      if (atomSizeElement) {
        const size = (0.2 + mouseX * 0.2).toFixed(2);
        atomSizeElement.textContent = size;
      }
      
      if (electronsElement) {
        const electrons = Math.floor(2 + mouseY * 6);
        electronsElement.textContent = electrons;
      }
    }
  }
  
  onMouseMove(event) {
    // Update mouse position (normalized from 0 to 1)
    this.mouse.x = event.clientX / window.innerWidth;
    this.mouse.y = 1.0 - (event.clientY / window.innerHeight); // Invert Y for mathematical convention
    
    // Update uniform if it exists
    if (this.uniforms && this.uniforms.u_mouse) {
      this.uniforms.u_mouse.value = this.mouse;
    }
    
    // Update formula values
    this.updateFormulaValues();
    
    // Animate the philosophical quote
    this.animateQuote(event);
  }
  
  onTouchMove(event) {
    // Prevent default to avoid scrolling
    event.preventDefault();
    
    if (event.touches.length > 0) {
      // Update mouse position (normalized from 0 to 1)
      this.mouse.x = event.touches[0].clientX / window.innerWidth;
      this.mouse.y = 1.0 - (event.touches[0].clientY / window.innerHeight); // Invert Y for mathematical convention
      
      // Update uniform if it exists
      if (this.uniforms && this.uniforms.u_mouse) {
        this.uniforms.u_mouse.value = this.mouse;
      }
      
      // Update formula values
      this.updateFormulaValues();
      
      // Animate the philosophical quote
      this.animateQuote({ 
        clientX: event.touches[0].clientX, 
        clientY: event.touches[0].clientY 
      });
    }
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
    infoElement.style.color = '#00ffff';
    infoElement.style.fontFamily = '"VT323", "Courier New", monospace';
    infoElement.style.fontSize = '18px';
    infoElement.style.borderRadius = '5px';
    infoElement.style.zIndex = '1000';
    infoElement.textContent = 'Move mouse: X = atom size, Y = electrons';
    document.body.appendChild(infoElement);
    
    // Fade out after 5 seconds
    setTimeout(() => {
      infoElement.style.transition = 'opacity 1s';
      infoElement.style.opacity = '0';
      setTimeout(() => infoElement.remove(), 1000);
    }, 5000);
  }
  
  addPhilosophicalQuote() {
    // Create quote container
    this.quoteElement = document.createElement('div');
    this.quoteElement.id = 'philosophical-quote';
    this.quoteElement.style.position = 'absolute';
    this.quoteElement.style.top = '25%'; // Moved up to avoid formula text
    this.quoteElement.style.left = '50%';
    this.quoteElement.style.transform = 'translate(-50%, -50%)';
    this.quoteElement.style.width = '70%';
    this.quoteElement.style.maxWidth = '800px';
    this.quoteElement.style.padding = '20px';
    this.quoteElement.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    this.quoteElement.style.color = '#ffffff';
    this.quoteElement.style.fontFamily = '"Times New Roman", serif';
    this.quoteElement.style.fontSize = '20px';
    this.quoteElement.style.lineHeight = '1.6';
    this.quoteElement.style.textAlign = 'center';
    this.quoteElement.style.borderRadius = '10px';
    this.quoteElement.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
    this.quoteElement.style.zIndex = '1002'; // Higher z-index to ensure it's above formula
    this.quoteElement.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    this.quoteElement.style.textShadow = '0 0 5px rgba(0, 255, 255, 0.5)';
    
    // Add the quote text
    this.quoteElement.innerHTML = `
      "In the sacred dance of the universe, fractals mirror the infinite within the finite, 
      each pattern echoing the breath of creation. Quantum physics whispers that reality is not solid, 
      but woven from probabilities—just as fractals emerge from simple laws into endless complexity. 
      In this harmony, spirit and science converge, revealing that the cosmos may be a divine self-reflecting dream."
    `;
    
    // Add to DOM
    document.body.appendChild(this.quoteElement);
  }
  
  animateQuote(event) {
    if (!this.quoteElement) return;
    
    // Calculate distance from mouse to center of quote
    const rect = this.quoteElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate normalized distance (-1 to 1)
    const maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    const dx = (event.clientX - centerX) / maxDistance;
    const dy = (event.clientY - centerY) / maxDistance;
    
    // Limit the movement range
    const maxMovement = 10;
    const moveX = Math.max(-maxMovement, Math.min(maxMovement, dx * maxMovement));
    const moveY = Math.max(-maxMovement, Math.min(maxMovement, dy * maxMovement));
    
    // Apply subtle 3D transform - note we're using 25% for Y position now
    this.quoteElement.style.transform = `translate(-50%, -50%) translate3d(${moveX}px, ${moveY}px, 0) rotateX(${-moveY * 0.5}deg) rotateY(${moveX * 0.5}deg)`;
    
    // Adjust glow based on mouse position
    const distance = Math.sqrt(dx * dx + dy * dy);
    const glowIntensity = Math.max(0.3, 1 - distance);
    const glowColor = `rgba(0, 255, 255, ${glowIntensity * 0.3})`;
    this.quoteElement.style.boxShadow = `0 0 ${20 + glowIntensity * 10}px ${glowColor}`;
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