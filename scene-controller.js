// Scene controller for managing scene transitions
import { DemoScene } from './main.js';
import { PsychedelicEffect } from './shader_integration.js';
import { CRTPsychedelicEffect } from './crt_shader_integration.js';
import { SierpinskiScene } from './sierpinski_scene.js';
import { FractalScene } from './fractal_scene.js';
import { MandelbrotScene } from './mandelbrot_scene.js';
import { NewtonScene } from './newton_scene.js';
import { getAudioController } from './audio-controller.js';
import { MengerScene } from './menger_scene.js';
import { KochScene } from './koch_scene.js';
import { BloodScene } from './blood_scene.js';
import { AtomsScene } from './atoms_scene.js';

class SceneController {
  constructor() {
    this.currentScene = null;
    this.currentSceneType = null;
    this.currentSceneNumber = 1;
    this.transitionElement = document.getElementById('scene-transition');
    
    // Get text animation elements
    this.bannerContainer = document.getElementById('banner-container');
    this.starwarsContainer = document.getElementById('starwars-container');
  }
  
  // Initialize the scene based on URL parameter
  initializeScene() {
    const urlParams = new URLSearchParams(window.location.search);
    const effect = urlParams.get('effect') || 'crt';
    
    // Initialize the selected effect
    try {
      if (effect === 'basic') {
        this.createScene('basic');
      } else if (effect === 'psychedelic') {
        this.createScene('psychedelic');
      } else {
        // Default to CRT effect
        this.createScene('crt');
      }
      console.log(`Fractal Madness started with ${effect} effect`);
    } catch (error) {
      console.error('Error initializing effect:', error);
      // Fallback to basic scene if there's an error
      try {
        this.createScene('basic');
        console.log('Fallback to basic scene due to error');
      } catch (e) {
        console.error('Critical error, could not initialize any effect:', e);
      }
    }
    
    // Update text animation based on scene
    this.updateTextAnimation();
  }
  
  // Create a scene of the specified type
  createScene(sceneType) {
    // Clean up previous scene if it exists
    if (this.currentScene) {
      this.cleanupCurrentScene();
    }
    
    // Add a class to the body to trigger enter animation
    document.body.classList.add('scene-enter');
    
    // Remove any existing philosophical quote to ensure it only appears in scene 9
    const existingQuote = document.getElementById('philosophical-quote');
    if (existingQuote) {
      existingQuote.remove();
    }
    
    // Create the new scene
    switch (sceneType) {
      case 'basic':
        this.currentScene = new DemoScene();
        this.currentSceneNumber = 1;
        break;
      case 'psychedelic':
        this.currentScene = new PsychedelicEffect();
        this.currentSceneNumber = 1;
        break;
      case 'crt':
        this.currentScene = new CRTPsychedelicEffect();
        this.currentSceneNumber = 1;
        break;
      case 'sierpinski':
        this.currentScene = new SierpinskiScene();
        this.currentSceneNumber = 2;
        break;
      case 'fractal':
        this.currentScene = new FractalScene();
        this.currentSceneNumber = 3;
        break;
      case 'mandelbrot':
        this.currentScene = new MandelbrotScene();
        this.currentSceneNumber = 4;
        break;
      case 'newton':
        this.currentScene = new NewtonScene();
        this.currentSceneNumber = 5;
        break;
      case 'menger':
        this.currentScene = new MengerScene();
        this.currentSceneNumber = 6;
        break;
      case 'koch':
        this.currentScene = new KochScene();
        this.currentSceneNumber = 7;
        break;
      case 'blood':
        this.currentScene = new BloodScene();
        this.currentSceneNumber = 8;
        break;
      case 'atoms':
        this.currentScene = new AtomsScene();
        this.currentSceneNumber = 9;
        break;
      default:
        this.currentScene = new CRTPsychedelicEffect();
        this.currentSceneNumber = 1;
    }
    
    this.currentSceneType = sceneType;
    this.updateSceneButtonAppearance();
    
    // Update text animation based on scene
    this.updateTextAnimation();
    
    // Dispatch event for scene change
    window.dispatchEvent(new CustomEvent('scene-changed', { 
      detail: { sceneNumber: this.currentSceneNumber, sceneType: this.currentSceneType } 
    }));
    
    // Make the scene globally accessible
    window.demoEffect = this.currentScene;
    
    // Update scene button appearance (which now also handles the philosophical quote visibility)
    this.updateSceneButtonAppearance();
    
    // Remove the enter animation class after animation completes
    setTimeout(() => {
      document.body.classList.remove('scene-enter');
    }, 1000);
    
    return this.currentScene;
  }
  
  // Update text animation based on current scene
  updateTextAnimation() {
    if (this.currentSceneNumber === 1) {
      // Show Star Wars style intro for Scene 1
      if (this.starwarsContainer) this.starwarsContainer.style.display = 'block';
      if (this.bannerContainer) this.bannerContainer.style.display = 'none';
    } else {
      // Show scrolling banner for other scenes
      if (this.starwarsContainer) this.starwarsContainer.style.display = 'none';
      if (this.bannerContainer) this.bannerContainer.style.display = 'block';
    }
  }
  
  // Cycle to the next scene (kept for compatibility but no longer used directly)
  nextScene() {
    // Start transition animation
    this.startTransition(() => {
      switch (this.currentSceneNumber) {
        case 1:
          this.createScene('sierpinski');
          break;
        case 2:
          this.createScene('fractal');
          break;
        case 3:
          this.createScene('mandelbrot');
          break;
        case 4:
          this.createScene('newton');
          break;
        case 5:
          this.createScene('menger');
          break;
        case 6:
          this.createScene('koch');
          break;
        case 7:
          this.createScene('blood');
          break;
        case 8:
          this.createScene('atoms');
          break;
        case 9:
          // Go back to original scene type
          const urlParams = new URLSearchParams(window.location.search);
          const originalEffect = urlParams.get('effect') || 'crt';
          this.createScene(originalEffect);
          break;
      }
    });
  }
  
  // Start transition animation
  startTransition(callback) {
    if (!this.transitionElement) return;
    
    // Fade in
    this.transitionElement.style.opacity = '1';
    this.transitionElement.style.pointerEvents = 'auto';
    
    // Add a custom animation class
    this.transitionElement.classList.add('transition-active');
    
    // Execute callback after fade in
    setTimeout(() => {
      if (callback) callback();
      
      // Fade out
      setTimeout(() => {
        this.transitionElement.style.opacity = '0';
        this.transitionElement.style.pointerEvents = 'none';
        this.transitionElement.classList.remove('transition-active');
      }, 300);
    }, 500);
  }
  
  // Clean up the current scene
  cleanupCurrentScene() {
    if (!this.currentScene) return;
    
    // Remove renderer from DOM if it exists
    if (this.currentScene.renderer && this.currentScene.renderer.domElement) {
      document.body.removeChild(this.currentScene.renderer.domElement);
    }
    
    // Stop animation loop if possible
    if (typeof this.currentScene.animate === 'function') {
      // Replace the animate method with an empty function
      this.currentScene.animate = () => {};
    }
    
    // Remove audio element if it exists
    if (this.currentScene.audioElement) {
      this.currentScene.audioElement.pause();
      if (this.currentScene.audioElement.parentNode) {
        this.currentScene.audioElement.parentNode.removeChild(this.currentScene.audioElement);
      }
    }
    
    // Disconnect audio context if it exists
    if (this.currentScene.audioContext) {
      try {
        this.currentScene.audioContext.close();
      } catch (e) {
        console.warn('Error closing audio context:', e);
      }
    }
    
    // Remove event listeners if possible
    if (typeof this.currentScene.removeEventListeners === 'function') {
      this.currentScene.removeEventListeners();
    }
    
    // Remove philosophical quote if it exists
    const philosophicalQuote = document.getElementById('philosophical-quote');
    if (philosophicalQuote) {
      philosophicalQuote.remove();
    }
    
    // Set to null to help garbage collection
    this.currentScene = null;
  }
  
  // Update scene information (removed button appearance)
  updateSceneButtonAppearance() {
    // This method is kept for compatibility but no longer updates any button
    // It might be used by other parts of the code
    
    // Check if we need to show or hide the philosophical quote
    const philosophicalQuote = document.getElementById('philosophical-quote');
    if (philosophicalQuote) {
      // Only show the quote in scene 9
      if (this.currentSceneNumber === 9) {
        philosophicalQuote.style.display = 'block';
      } else {
        philosophicalQuote.style.display = 'none';
      }
    }
  }
}

// Create a singleton instance
let sceneControllerInstance = null;

export function getSceneController() {
  if (!sceneControllerInstance) {
    sceneControllerInstance = new SceneController();
  }
  return sceneControllerInstance;
}