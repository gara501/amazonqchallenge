// Audio controller for the demoscene
// Manages audio playback and provides a global interface for muting/unmuting

class AudioController {
  constructor() {
    // Initialize state
    this.audioElements = [];
    this.audioContexts = [];
    this.isMuted = false;
    
    // Set up mute button
    this.setupMuteButton();
    
    // Store previous volume levels for each audio element
    this.previousVolumes = new Map();
    
    // Listen for new audio elements
    this.observeAudioElements();
  }
  
  setupMuteButton() {
    this.muteButton = document.getElementById('mute-button');
    
    if (this.muteButton) {
      // Set initial state
      this.updateMuteButtonAppearance();
      
      // Add click event
      this.muteButton.addEventListener('click', () => {
        this.toggleMute();
      });
    }
  }
  
  observeAudioElements() {
    // Find all existing audio elements
    const existingAudio = document.querySelectorAll('audio');
    existingAudio.forEach(audio => this.registerAudioElement(audio));
    
    // Watch for new audio elements being added to the DOM
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(node => {
            // Check if the added node is an audio element
            if (node.nodeName === 'AUDIO') {
              this.registerAudioElement(node);
            }
            
            // Check for audio elements inside the added node
            if (node.querySelectorAll) {
              const audioElements = node.querySelectorAll('audio');
              audioElements.forEach(audio => this.registerAudioElement(audio));
            }
          });
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  registerAudioElement(audioElement) {
    // Check if we already registered this element
    if (this.audioElements.includes(audioElement)) {
      return;
    }
    
    // Add to our list
    this.audioElements.push(audioElement);
    
    // Store original volume
    this.previousVolumes.set(audioElement, audioElement.volume);
    
    // Apply current mute state
    if (this.isMuted) {
      audioElement.volume = 0;
    }
    
    console.log('Audio element registered with AudioController');
  }
  
  registerAudioContext(audioContext) {
    if (this.audioContexts.includes(audioContext)) {
      return;
    }
    
    this.audioContexts.push(audioContext);
    console.log('AudioContext registered with AudioController');
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      // Mute all audio elements
      this.audioElements.forEach(audio => {
        // Store current volume before muting
        this.previousVolumes.set(audio, audio.volume);
        audio.volume = 0;
      });
    } else {
      // Restore previous volumes
      this.audioElements.forEach(audio => {
        const previousVolume = this.previousVolumes.get(audio) || 1;
        audio.volume = previousVolume;
      });
    }
    
    // Update button appearance
    this.updateMuteButtonAppearance();
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('audio-mute-changed', { 
      detail: { muted: this.isMuted } 
    }));
    
    console.log(`Audio ${this.isMuted ? 'muted' : 'unmuted'}`);
  }
  
  updateMuteButtonAppearance() {
    if (!this.muteButton) return;
    
    if (this.isMuted) {
      this.muteButton.classList.add('muted');
      this.muteButton.innerHTML = '✕';
      this.muteButton.title = 'Unmute Sound';
    } else {
      this.muteButton.classList.remove('muted');
      this.muteButton.innerHTML = '♪';
      this.muteButton.title = 'Mute Sound';
    }
  }
  
  // Public methods
  mute() {
    if (!this.isMuted) {
      this.toggleMute();
    }
  }
  
  unmute() {
    if (this.isMuted) {
      this.toggleMute();
    }
  }
  
  isSoundMuted() {
    return this.isMuted;
  }
}

// Create a singleton instance
let audioControllerInstance = null;

function getAudioController() {
  if (!audioControllerInstance) {
    audioControllerInstance = new AudioController();
  }
  return audioControllerInstance;
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.audioController = getAudioController();
});

export { getAudioController };