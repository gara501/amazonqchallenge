// lateral-menu.js - Creates a lateral menu with animated buttons for scene navigation

import { getSceneController } from './scene-controller.js';

class LateralMenu {
  constructor() {
    // Create the menu container
    this.createMenuContainer();
    
    // Create scene buttons
    this.createSceneButtons();
    
    // Get scene controller
    this.sceneController = getSceneController();
    
    // Listen for scene changes
    this.setupSceneChangeListener();
    
    // Add hover animations
    this.addHoverAnimations();
  }
  
  createMenuContainer() {
    // Create menu container
    this.menuContainer = document.createElement('div');
    this.menuContainer.id = 'lateral-menu';
    this.menuContainer.className = 'lateral-menu visible'; // Added 'visible' class to keep menu open by default
    
    // Add to DOM
    document.body.appendChild(this.menuContainer);
    
    // Add CSS for the menu
    const style = document.createElement('style');
    style.textContent = `
      .lateral-menu {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 15px;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border-radius: 0 15px 15px 0;
        z-index: 1500;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease;
        transform: translateX(-100%) translateY(-50%);
      }
      
      .lateral-menu.visible {
        transform: translateX(0) translateY(-50%);
      }
      
      .lateral-menu-button {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        font-family: "VT323", "Courier New", monospace;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .lateral-menu-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .lateral-menu-button:hover::before {
        opacity: 1;
      }
      
      .lateral-menu-button.active {
        transform: scale(1.1);
        box-shadow: 0 0 15px currentColor;
      }
      
      .lateral-menu-button.scene-1 {
        color: #00ffff;
        border-color: #00ffff;
        text-shadow: 0 0 5px #00ffff;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
      
      .lateral-menu-button.scene-2 {
        color: #ffcc00;
        border-color: #ffcc00;
        text-shadow: 0 0 5px #ffcc00;
        box-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
      }
      
      .lateral-menu-button.scene-3 {
        color: #ff00ff;
        border-color: #ff00ff;
        text-shadow: 0 0 5px #ff00ff;
        box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
      }
      
      .lateral-menu-button.scene-4 {
        color: #00ff88;
        border-color: #00ff88;
        text-shadow: 0 0 5px #00ff88;
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
      }
      
      .lateral-menu-button.scene-5 {
        color: #ff8800;
        border-color: #ff8800;
        text-shadow: 0 0 5px #ff8800;
        box-shadow: 0 0 10px rgba(255, 136, 0, 0.5);
      }
      
      .lateral-menu-button.scene-6 {
        color: #00bfff;
        border-color: #00bfff;
        text-shadow: 0 0 5px #00bfff;
        box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
      }
      
      .lateral-menu-button.scene-7 {
        color: #00ffaa;
        border-color: #00ffaa;
        text-shadow: 0 0 5px #00ffaa;
        box-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
      }
      
      .lateral-menu-toggle {
        position: fixed;
        left: 20px;
        top: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 1600;
        font-size: 20px;
        transition: all 0.3s ease;
      }
      
      .lateral-menu-toggle:hover {
        background: rgba(0, 0, 0, 0.7);
        transform: scale(1.1);
      }
      
      .lateral-menu-tooltip {
        position: absolute;
        left: 70px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-family: "VT323", "Courier New", monospace;
        font-size: 14px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      
      .lateral-menu-button:hover .lateral-menu-tooltip {
        opacity: 1;
      }
      
      /* Scene transition overlay */
      .scene-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 1800;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
      }
      
      .scene-transition-overlay.active {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    // Create toggle button
    this.toggleButton = document.createElement('div');
    this.toggleButton.className = 'lateral-menu-toggle';
    this.toggleButton.innerHTML = '≡';
    this.toggleButton.title = 'Toggle Scene Menu';
    document.body.appendChild(this.toggleButton);
    
    // Add click event to toggle button
    this.toggleButton.addEventListener('click', () => {
      this.menuContainer.classList.toggle('visible');
      this.toggleButton.innerHTML = this.menuContainer.classList.contains('visible') ? '×' : '≡';
    });
    
    // Set initial toggle button state to match menu visibility
    this.toggleButton.innerHTML = '×';
    
    // Create transition overlay
    this.transitionOverlay = document.createElement('div');
    this.transitionOverlay.className = 'scene-transition-overlay';
    document.body.appendChild(this.transitionOverlay);
  }
  
  createSceneButtons() {
    // Scene names and descriptions
    const scenes = [
      { name: 'Psychedelic', type: 'crt', number: 1 },
      { name: 'Sierpinski', type: 'sierpinski', number: 2 },
      { name: 'Julia Set', type: 'fractal', number: 3 },
      { name: 'Mandelbrot', type: 'mandelbrot', number: 4 },
      { name: 'Newton', type: 'newton', number: 5 },
      { name: 'Menger Sponge', type: 'menger', number: 6 },
      { name: 'Koch Curve', type: 'koch', number: 7 },
      { name: 'Blood Vessels', type: 'blood', number: 8 },
      { name: 'Atoms', type: 'atoms', number: 9 }
    ];
    
    // Create buttons for each scene
    scenes.forEach(scene => {
      const button = document.createElement('div');
      button.className = `lateral-menu-button scene-${scene.number}`;
      button.innerHTML = scene.number;
      button.dataset.scene = scene.type;
      button.dataset.sceneNumber = scene.number;
      
      // Add tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'lateral-menu-tooltip';
      tooltip.textContent = scene.name;
      button.appendChild(tooltip);
      
      // Add click event
      button.addEventListener('click', () => {
        this.switchScene(scene.type, scene.number);
      });
      
      // Add to menu
      this.menuContainer.appendChild(button);
    });
  }
  
  setupSceneChangeListener() {
    // Listen for scene changes
    window.addEventListener('scene-changed', (event) => {
      const sceneNumber = event.detail.sceneNumber;
      
      // Update active button
      const buttons = this.menuContainer.querySelectorAll('.lateral-menu-button');
      buttons.forEach(button => {
        button.classList.remove('active');
        if (parseInt(button.dataset.sceneNumber) === sceneNumber) {
          button.classList.add('active');
        }
      });
    });
  }
  
  addHoverAnimations() {
    // Add hover animations to buttons
    const buttons = this.menuContainer.querySelectorAll('.lateral-menu-button');
    
    buttons.forEach(button => {
      // Pulse animation
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = button.classList.contains('active') ? 'scale(1.1)' : 'scale(1.0)';
      });
    });
  }
  
  switchScene(sceneType, sceneNumber) {
    // Start transition animation
    this.transitionOverlay.classList.add('active');
    
    // Switch scene after a short delay
    setTimeout(() => {
      if (this.sceneController) {
        this.sceneController.createScene(sceneType);
      }
      
      // End transition animation
      setTimeout(() => {
        this.transitionOverlay.classList.remove('active');
      }, 300);
    }, 500);
  }
}

// Initialize the lateral menu when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait a short time to ensure DOM is fully loaded
  setTimeout(() => {
    window.lateralMenu = new LateralMenu();
    
    // Make sure the menu is visible after initialization
    const menu = document.getElementById('lateral-menu');
    if (menu) {
      menu.classList.add('visible');
    }
  }, 1000);
});

export { LateralMenu };