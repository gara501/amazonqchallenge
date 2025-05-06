// Import Three.js library
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getAudioController } from './audio-controller.js';

// Main class for the demo scene
export class DemoScene {
  constructor() {
    // Setup the scene
    this.scene = new THREE.Scene();
    
    // Setup the camera
    this.camera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    this.camera.position.z = 5;
    
    // Setup the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000); // Black background
    document.body.appendChild(this.renderer.domElement);
    
    // Add orbit controls for mouse interaction
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Create objects and lights
    this.createLights();
    this.createObjects();
    
    // Setup background music
    this.setupBackgroundMusic();
    
    // Start the animation loop
    this.animate();
  }
  
  createLights() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight.position.set(0, 0, 3);
    this.scene.add(pointLight);
  }
  
  createObjects() {
    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ffff,
      shininess: 100,
      specular: 0xffffff
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    
    // Create a torus knot
    const torusGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff00ff,
      shininess: 100,
      specular: 0xffffff
    });
    this.torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    this.torusKnot.position.x = 2;
    this.scene.add(this.torusKnot);
    
    // Create a sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffff00,
      shininess: 100,
      specular: 0xffffff
    });
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphere.position.x = -2;
    this.scene.add(this.sphere);
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
    // Update camera aspect ratio and renderer size
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    // Rotate the objects
    const time = Date.now() * 0.001; // Convert to seconds
    
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    
    this.torusKnot.rotation.x = time * 0.5;
    this.torusKnot.rotation.y = time * 0.3;
    
    this.sphere.position.y = Math.sin(time) * 0.5;
    
    // Update controls
    this.controls.update();
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
}