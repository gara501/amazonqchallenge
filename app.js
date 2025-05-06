// Main application entry point
import { getAudioController } from './audio-controller.js';
import { getSceneController } from './scene-controller.js';

// Asset loader
class AssetLoader {
  constructor() {
    this.totalAssets = 13; // Shaders, music, textures, etc.
    this.loadedAssets = 0;
    this.loadingBar = document.getElementById('loading-bar');
    this.loadingScreen = document.getElementById('loading-screen');
    this.startButton = document.getElementById('start-button');
    
    // Initialize audio controller
    this.audioController = getAudioController();
    
    // Initialize scene controller
    this.sceneController = getSceneController();
    
    // Hide control buttons until demo starts
    const controlButtons = document.querySelectorAll('.control-button');
    controlButtons.forEach(button => {
      button.style.display = 'none';
    });
    
    // Preload assets
    this.preloadAssets();
    
    // Setup start button
    this.startButton.addEventListener('click', () => this.startDemo());
  }
  
  preloadAssets() {
    // Simulate loading assets with promises
    const assets = [
      this.loadShader('psychedelic_fragment.glsl'),
      this.loadShader('psychedelic_crt_fragment.glsl'),
      this.loadShader('sierpinski_fragment.glsl'),
      this.loadShader('sierpinski_vertex.glsl'),
      this.loadShader('julia_fragment.glsl'),
      this.loadShader('julia_vertex.glsl'),
      this.loadShader('mandelbrot_fragment.glsl'),
      this.loadShader('mandelbrot_vertex.glsl'),
      this.loadShader('newton_fragment.glsl'),
      this.loadShader('newton_vertex.glsl'),
      this.loadShader('menger_fragment.glsl'),
      this.loadShader('menger_vertex.glsl'),
      this.preloadAudio('assets/music.mp3'),
      this.preloadAudio('assets/music2.mp3'),
      this.preloadAudio('assets/music3.mp3'),
      this.preloadAudio('assets/music4.mp3'),
      this.preloadAudio('assets/music5.mp3'),
      this.preloadAudio('assets/music6.mp3')
    ];
    
    // Update progress for each loaded asset
    let loadedCount = 0;
    assets.forEach(promise => {
      promise.then(() => {
        loadedCount++;
        const progress = (loadedCount / this.totalAssets) * 100;
        this.loadingBar.style.width = `${progress}%`;
        
        // When all assets are loaded
        if (loadedCount === this.totalAssets) {
          this.onLoadComplete();
        }
      }).catch(error => {
        console.error('Error loading asset:', error);
        // Still increment counter to avoid getting stuck
        loadedCount++;
        const progress = (loadedCount / this.totalAssets) * 100;
        this.loadingBar.style.width = `${progress}%`;
        
        // When all assets are loaded (even with errors)
        if (loadedCount === this.totalAssets) {
          this.onLoadComplete();
        }
      });
    });
  }
  
  loadShader(path) {
    return fetch(path)
      .then(response => {
        if (!response.ok) {
          console.warn(`Failed to load shader: ${path}, but continuing anyway`);
        }
        return response.text();
      })
      .catch(error => {
        console.warn(`Error loading shader ${path}: ${error.message}`);
        return ""; // Return empty shader to continue
      });
  }
  
  preloadAudio(path) {
    return new Promise((resolve) => {
      try {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', () => {
          console.warn(`Audio file not found: ${path}, but continuing anyway`);
          resolve(); // Resolve anyway to continue
        });
        audio.src = path;
        
        // Set a timeout to resolve anyway after 3 seconds
        setTimeout(resolve, 3000);
      } catch (e) {
        console.warn('Audio preloading error:', e);
        resolve(); // Resolve anyway to continue
      }
    });
  }
  
  preloadTexture(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Texture file not found: ${path}, but continuing anyway`);
        resolve(); // Resolve anyway to continue
      };
      img.src = path;
      
      // Set a timeout to resolve anyway after 3 seconds
      setTimeout(resolve, 3000);
    });
  }
  
  onLoadComplete() {
    // Show start button
    this.startButton.style.display = 'block';
    this.loadingText = document.getElementById('loading-text');
    this.loadingText.textContent = 'READY!';
  }
  
  startDemo() {
    // Fade out loading screen
    this.loadingScreen.style.opacity = '0';
    setTimeout(() => {
      this.loadingScreen.style.display = 'none';
      
      // Show control buttons
      const controlButtons = document.querySelectorAll('.control-button');
      controlButtons.forEach(button => {
        button.style.display = 'flex';
      });
      
      // Initialize the demo
      this.sceneController.initializeScene();
    }, 1000);
  }
}

// Initialize the loader when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new AssetLoader();
});