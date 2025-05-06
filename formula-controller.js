// Formula controller for managing formula overlays in fractal scenes

class FormulaController {
  constructor() {
    // Get all formula containers
    this.formulaContainers = {
      sierpinski: document.getElementById('formula-sierpinski'),
      julia: document.getElementById('formula-julia'),
      mandelbrot: document.getElementById('formula-mandelbrot'),
      newton: document.getElementById('formula-newton'),
      menger: document.getElementById('formula-menger')
    };
    
    // Get formula value elements
    this.formulaValues = {
      sierpinskiScale: document.getElementById('sierpinski-scale'),
      sierpinskiVariation: document.getElementById('sierpinski-variation'),
      juliaC: document.getElementById('julia-c'),
      mandelbrotOffset: document.getElementById('mandelbrot-offset'),
      newtonDegree: document.getElementById('newton-degree'),
      newtonRelaxation: document.getElementById('newton-relaxation')
    };
    
    // Initialize mouse position
    this.mousePosition = { x: 0, y: 0 };
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Listen for scene changes
    this.setupSceneChangeListener();
    
    // Current scene number
    this.currentScene = 1;
  }
  
  setupEventListeners() {
    // Track mouse position for hover effects
    document.addEventListener('mousemove', (event) => {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
      
      // Apply hover effect to formula containers
      this.applyHoverEffect();
      
      // Update formula values based on mouse position
      this.updateFormulaValues();
    });
    
    // Handle touch events for mobile
    document.addEventListener('touchmove', (event) => {
      if (event.touches.length > 0) {
        this.mousePosition.x = event.touches[0].clientX;
        this.mousePosition.y = event.touches[0].clientY;
        
        // Apply hover effect to formula containers
        this.applyHoverEffect();
        
        // Update formula values based on touch position
        this.updateFormulaValues();
      }
    });
  }
  
  setupSceneChangeListener() {
    // Listen for scene changes
    window.addEventListener('scene-changed', (event) => {
      const sceneNumber = event.detail.sceneNumber;
      this.currentScene = sceneNumber;
      
      // Hide all formula containers
      Object.values(this.formulaContainers).forEach(container => {
        if (container) container.style.display = 'none';
      });
      
      // Show the appropriate formula container based on scene
      switch (sceneNumber) {
        case 2: // Sierpinski
          if (this.formulaContainers.sierpinski) {
            this.formulaContainers.sierpinski.style.display = 'block';
            this.renderMathJax();
          }
          break;
        case 3: // Julia
          if (this.formulaContainers.julia) {
            this.formulaContainers.julia.style.display = 'block';
            this.renderMathJax();
          }
          break;
        case 4: // Mandelbrot
          if (this.formulaContainers.mandelbrot) {
            this.formulaContainers.mandelbrot.style.display = 'block';
            this.renderMathJax();
          }
          break;
        case 5: // Newton
          if (this.formulaContainers.newton) {
            this.formulaContainers.newton.style.display = 'block';
            this.renderMathJax();
          }
          break;
        case 6: // Menger
          if (this.formulaContainers.menger) {
            this.formulaContainers.menger.style.display = 'block';
            this.renderMathJax();
          }
          break;
      }
    });
  }
  
  applyHoverEffect() {
    // Get the current formula container based on scene
    let currentContainer = null;
    switch (this.currentScene) {
      case 2:
        currentContainer = this.formulaContainers.sierpinski;
        break;
      case 3:
        currentContainer = this.formulaContainers.julia;
        break;
      case 4:
        currentContainer = this.formulaContainers.mandelbrot;
        break;
      case 5:
        currentContainer = this.formulaContainers.newton;
        break;
      case 5:
        currentContainer = this.formulaContainers.menger;
        break;
    }
    
    if (!currentContainer) return;
    
    // Get the formula box element
    const formulaBox = currentContainer.querySelector('.formula-box');
    if (!formulaBox) return;
    
    // Calculate distance from mouse to center of formula box
    const rect = formulaBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate normalized distance (-1 to 1)
    const maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    const dx = (this.mousePosition.x - centerX) / maxDistance;
    const dy = (this.mousePosition.y - centerY) / maxDistance;
    
    // Limit the movement range
    const maxMovement = 10;
    const moveX = Math.max(-maxMovement, Math.min(maxMovement, dx * maxMovement));
    const moveY = Math.max(-maxMovement, Math.min(maxMovement, dy * maxMovement));
    
    // Apply subtle 3D transform
    formulaBox.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${-moveY * 0.5}deg) rotateY(${moveX * 0.5}deg)`;
    
    // Adjust shadow based on mouse position
    const shadowX = -moveX * 0.5;
    const shadowY = -moveY * 0.5;
    const shadowBlur = 20 + Math.abs(moveX) + Math.abs(moveY);
    formulaBox.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.5)`;
    
    // Add subtle glow effect based on scene
    let glowColor;
    switch (this.currentScene) {
      case 2:
        glowColor = 'rgba(255, 204, 0, 0.3)';
        break;
      case 3:
        glowColor = 'rgba(255, 0, 255, 0.3)';
        break;
      case 4:
        glowColor = 'rgba(0, 255, 136, 0.3)';
        break;
      case 5:
        glowColor = 'rgba(255, 136, 0, 0.3)';
        break;
    }
    
    if (glowColor) {
      const distance = Math.sqrt(dx * dx + dy * dy);
      const glowIntensity = Math.max(0, 1 - distance * 2);
      formulaBox.style.boxShadow += `, 0 0 ${15 + glowIntensity * 15}px ${glowColor}`;
    }
  }
  
  updateFormulaValues() {
    // Normalize mouse position (0 to 1)
    const normalizedX = this.mousePosition.x / window.innerWidth;
    const normalizedY = 1.0 - (this.mousePosition.y / window.innerHeight); // Invert Y
    
    // Update values based on current scene
    switch (this.currentScene) {
      case 2: // Sierpinski
        if (this.formulaValues.sierpinskiScale) {
          const scale = (1.8 + normalizedX * 0.4).toFixed(2);
          this.formulaValues.sierpinskiScale.textContent = scale;
        }
        if (this.formulaValues.sierpinskiVariation) {
          const variation = (0.5 + normalizedY * 1.5).toFixed(2);
          this.formulaValues.sierpinskiVariation.textContent = variation;
        }
        break;
        
      case 3: // Julia
        if (this.formulaValues.juliaC) {
          const real = (-0.8 + normalizedX * 1.6).toFixed(2);
          const imag = (-0.8 + normalizedY * 1.6).toFixed(2);
          const sign = imag >= 0 ? '+' : '';
          this.formulaValues.juliaC.textContent = `${real} ${sign} ${imag}i`;
        }
        break;
        
      case 4: // Mandelbrot
        if (this.formulaValues.mandelbrotOffset) {
          const offsetX = (normalizedX * 2 - 1).toFixed(2);
          const offsetY = (normalizedY * 2 - 1).toFixed(2);
          this.formulaValues.mandelbrotOffset.textContent = `(${offsetX}, ${offsetY})`;
        }
        break;
        
      case 5: // Newton
        if (this.formulaValues.newtonDegree) {
          const degree = Math.floor(3 + normalizedX * 3);
          this.formulaValues.newtonDegree.textContent = degree;
        }
        if (this.formulaValues.newtonRelaxation) {
          const relaxation = (0.5 + normalizedY * 1.0).toFixed(2);
          this.formulaValues.newtonRelaxation.textContent = relaxation;
        }
        break;
    }
  }
  
  renderMathJax() {
    // Render MathJax formulas if MathJax is loaded
    if (window.MathJax) {
      try {
        window.MathJax.typeset();
      } catch (e) {
        console.warn('Error rendering MathJax:', e);
      }
    }
  }
}

// Initialize the formula controller when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait a short time to ensure DOM is fully loaded
  setTimeout(() => {
    window.formulaController = new FormulaController();
  }, 500);
});

// Export the FormulaController class
export { FormulaController };