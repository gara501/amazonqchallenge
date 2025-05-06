// Banner text controller for the demoscene
class BannerController {
  constructor(options = {}) {
    // Default options
    this.options = {
      containerId: 'banner-container',
      textId: 'banner-text',
      starwarsContainerId: 'starwars-container',
      starwarsTextId: 'starwars-text',
      speed: 100, // pixels per second
      messages: [
        "*** WELCOME TO THE ULTIMATE RETRO DEMOSCENE EXPERIENCE ***",
        "*** GREETINGS TO ALL THE CODERS, ARTISTS AND MUSICIANS OUT THERE ***",
        "*** THIS DEMO IS POWERED BY THREE.JS AND WEBGL ***",
        "*** TURN UP THE VOLUME AND ENJOY THE RIDE ***",
        "*** SPECIAL THANKS TO THE DEMOSCENE COMMUNITY FOR THE INSPIRATION ***"
      ],
      ...options
    };
    
    // Initialize the banner
    this.init();
  }
  
  init() {
    // Get DOM elements
    this.container = document.getElementById(this.options.containerId);
    this.textElement = document.getElementById(this.options.textId);
    this.starwarsContainer = document.getElementById(this.options.starwarsContainerId);
    this.starwarsText = document.getElementById(this.options.starwarsTextId);
    
    // If elements don't exist, create them
    if (!this.container || !this.textElement) {
      console.warn('Banner elements not found, creating them');
      this.createBannerElements();
    }
    
    // Set initial text
    this.updateBannerText();
    
    // Add dynamic speed control
    this.setupSpeedControl();
    
    // Add text color cycling
    this.setupColorCycling();
    
    // Listen for scene changes
    this.setupSceneChangeListener();
  }
  
  createBannerElements() {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.options.containerId;
      this.container.className = 'banner-container';
      document.body.appendChild(this.container);
    }
    
    // Create text element if it doesn't exist
    if (!this.textElement) {
      this.textElement = document.createElement('div');
      this.textElement.id = this.options.textId;
      this.textElement.className = 'banner-text';
      this.container.appendChild(this.textElement);
    }
    
    // Create Star Wars container if it doesn't exist
    if (!this.starwarsContainer) {
      this.starwarsContainer = document.createElement('div');
      this.starwarsContainer.id = this.options.starwarsContainerId;
      this.starwarsContainer.className = 'starwars-container';
      document.body.appendChild(this.starwarsContainer);
    }
    
    // Create Star Wars text element if it doesn't exist
    if (!this.starwarsText) {
      this.starwarsText = document.createElement('div');
      this.starwarsText.id = this.options.starwarsTextId;
      this.starwarsText.className = 'starwars-text';
      this.starwarsContainer.appendChild(this.starwarsText);
    }
    
    // Add CSS if not already present
    this.addCSS();
  }
  
  addCSS() {
    const css = `
      .banner-container {
        position: fixed;
        bottom: 30px;
        left: 0;
        width: 100%;
        height: 40px;
        overflow: hidden;
        z-index: 1000;
      }
      
      .banner-text {
        position: absolute;
        bottom: 0;
        white-space: nowrap;
        color: #00ffff;
        font-family: "VT323", "Courier New", monospace;
        font-size: 28px;
        text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff;
        transform: translateX(100%);
      }
      
      .banner-container::before,
      .banner-container::after {
        content: "";
        position: absolute;
        top: 0;
        width: 50px;
        height: 100%;
        z-index: 2;
      }
      
      .banner-container::before {
        left: 0;
        background: linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0));
      }
      
      .banner-container::after {
        right: 0;
        background: linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0));
      }
      
      .starwars-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        perspective: 400px;
        overflow: hidden;
        z-index: 1000;
      }
      
      .starwars-text {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        color: #ffff00;
        font-family: "VT323", "Courier New", monospace;
        font-size: 36px;
        text-align: center;
        transform-origin: 50% 100%;
        transform: translateY(0) rotateX(25deg);
        animation: starwars-scroll 60s linear infinite;
      }
      
      @keyframes starwars-scroll {
        0% {
          top: 100%;
        }
        100% {
          top: -300%;
        }
      }
    `;
    
    // Only add if not already present
    if (!document.querySelector('style[data-banner-styles]')) {
      const style = document.createElement('style');
      style.setAttribute('data-banner-styles', 'true');
      style.textContent = css;
      document.head.appendChild(style);
    }
    
    // Add Google Font for retro look if not already present
    if (!document.querySelector('link[href*="VT323"]')) {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  
  updateBannerText() {
    // Join all messages with spacing
    const fullText = this.options.messages.join(' ');
    this.textElement.textContent = fullText;
    
    // Start the animation
    this.startScrolling();
  }
  
  startScrolling() {
    // Make sure the element is visible
    this.textElement.style.display = 'block';
    
    // Reset position
    this.textElement.style.transform = 'translateX(100%)';
    this.textElement.style.transition = 'none';
    
    // Force reflow
    void this.textElement.offsetWidth;
    
    // Calculate animation duration based on text length and speed
    const textWidth = this.textElement.offsetWidth;
    const viewportWidth = window.innerWidth;
    const totalDistance = textWidth + viewportWidth;
    const duration = totalDistance / this.options.speed;
    
    // Set animation
    this.textElement.style.transition = `transform ${duration}s linear`;
    
    // Trigger animation after a small delay to ensure transition is applied
    setTimeout(() => {
      this.textElement.style.transform = `translateX(-${textWidth}px)`;
      
      // Reset when animation completes
      setTimeout(() => {
        this.textElement.style.transition = 'none';
        this.startScrolling();
      }, duration * 1000);
    }, 50);
  }
  
  setupSpeedControl() {
    // Adjust speed based on audio if available
    const audioElement = document.querySelector('audio');
    if (audioElement && window.AudioContext) {
      try {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioElement);
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        analyser.fftSize = 32;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        // Update speed based on audio levels
        const updateSpeed = () => {
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate average level
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          
          // Map average to speed range (80-150)
          const newSpeed = 80 + (avg / 255) * 70;
          
          // Only update if speed changed significantly
          if (Math.abs(this.options.speed - newSpeed) > 5) {
            this.options.speed = newSpeed;
            this.startScrolling();
          }
        };
        
        // Update speed periodically
        setInterval(updateSpeed, 1000);
      } catch (e) {
        console.warn('Could not set up audio-reactive banner:', e);
      }
    }
  }
  
  setupColorCycling() {
    // Array of retro colors
    const colors = [
      '#00ffff', // cyan
      '#ff00ff', // magenta
      '#ffff00', // yellow
      '#00ff00', // green
      '#ff0088'  // hot pink
    ];
    
    let colorIndex = 0;
    
    // Change color every few seconds
    setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      const color = colors[colorIndex];
      
      if (this.textElement) {
        this.textElement.style.color = color;
        this.textElement.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
      }
    }, 3000);
  }
  
  setupSceneChangeListener() {
    // Listen for scene changes to update text display
    document.addEventListener('scene-changed', (event) => {
      const sceneNumber = event.detail.sceneNumber;
      
      if (sceneNumber === 1) {
        // Show Star Wars style intro for Scene 1
        if (this.starwarsContainer) this.starwarsContainer.style.display = 'block';
        if (this.container) this.container.style.display = 'none';
      } else {
        // Show scrolling banner for other scenes
        if (this.starwarsContainer) this.starwarsContainer.style.display = 'none';
        if (this.container) this.container.style.display = 'block';
      }
    });
  }
  
  // Public method to update banner text
  setText(messages) {
    if (Array.isArray(messages)) {
      this.options.messages = messages;
    } else {
      this.options.messages = [messages];
    }
    this.updateBannerText();
  }
  
  // Public method to update speed
  setSpeed(speed) {
    this.options.speed = speed;
    this.startScrolling();
  }
}

// Initialize the banner when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait a short time to ensure DOM is fully loaded
  setTimeout(() => {
    window.bannerController = new BannerController({
      containerId: 'banner-container',
      textId: 'banner-text',
      starwarsContainerId: 'starwars-container',
      starwarsTextId: 'starwars-text'
    });
  }, 100);
});

// Export the BannerController class
export { BannerController };