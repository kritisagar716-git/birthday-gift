// Main JavaScript for Digital Gift
let currentScreen = 1;
let totalScreens = 8;
let enteredPassword = '';
let correctPassword = CONFIG.password;
let musicMuted = false;
let audio = null;
let isPlaying = false;
let bouquetOpened = [false, false, false];
let letterOpened = false;
let typingInterval = null;
let particlesInterval = null;
let starsInterval = null;

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const screens = document.querySelectorAll('.screen');
const muteToggle = document.getElementById('mute-toggle');
const muteIcon = document.getElementById('mute-icon');
const particlesContainer = document.getElementById('particles');
const starsContainer = document.getElementById('stars');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// ===== INITIALIZATION =====
function initializeApp() {
  // Load config values into DOM
  populateConfig();
  
  // Setup loading screen
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 2500);
  
  // Setup event listeners
  setupEventListeners();
  
  // Start background particles
  startParticles();
  startStars();
  
  // Initialize audio
  initializeAudio();
  
  // Show first screen
  showScreen(1);
}

// Populate config values
function populateConfig() {
  // Screen 2
  document.getElementById('screen2-heading').textContent = CONFIG.screen2Text;
  
  // Bouquet images + notes
  for (let i = 0; i < 3; i++) {
    const imgEl = document.getElementById(`bouquet-img-${i}`);
    if (imgEl && CONFIG.bouquetImages[i]) {
      imgEl.src = CONFIG.bouquetImages[i];
    }
    const noteEl = document.getElementById(`note-${i}`);
    if (noteEl) {
      noteEl.textContent = CONFIG.bouquetNotes[i] || '';
    }
  }
  
  // Music
  document.getElementById('song-title').textContent = CONFIG.music.title;
  const albumArt = document.getElementById('album-art-img');
  if (albumArt) {
    albumArt.src = CONFIG.music.albumArt;
  }
  
  // Letter
  // Will be populated on open
  
  // Gallery
  for (let i = 0; i < 3; i++) {
    const imgEl = document.getElementById(`gallery-img-${i}`);
    const capEl = document.getElementById(`caption-${i}`);
    if (imgEl) imgEl.src = CONFIG.galleryPhotos[i];
    if (capEl) capEl.textContent = CONFIG.galleryCaptions[i];
  }
  
  // Certificate
  document.getElementById('award-title').textContent = CONFIG.certificateText;
  document.getElementById('congrats-text').textContent = CONFIG.congratulationsText;
  document.getElementById('his-name-cert').textContent = CONFIG.hisName;
  document.getElementById('my-name-cert').textContent = CONFIG.myName;
  const circlePhoto = document.getElementById('circle-photo');
  if (circlePhoto) circlePhoto.src = CONFIG.circularPhoto;
  
  // Final
  document.getElementById('final-message').textContent = CONFIG.finalMessage;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Password keypad
  document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', handleKeypadPress);
  });
  document.getElementById('clear-btn')?.addEventListener('click', clearPassword);
  
  // Screen 2
  document.getElementById('yes-btn')?.addEventListener('click', goToNextScreen);
  document.getElementById('no-btn')?.addEventListener('click', runAwayButton);
  
  // Screen 3
  document.querySelectorAll('.bouquet-item').forEach(item => {
    item.addEventListener('click', handleBouquetClick);
  });
  
  // Screen 4 - Music
  document.getElementById('play-btn')?.addEventListener('click', togglePlayPause);
  document.getElementById('prev-btn')?.addEventListener('click', prevTrack);
  document.getElementById('next-btn-music')?.addEventListener('click', nextTrack);
  document.querySelector('.progress-bar')?.addEventListener('click', seekMusic);
  
  // Screen 5
  document.getElementById('wax-seal')?.addEventListener('click', openLetter);
  document.getElementById('envelope')?.addEventListener('click', (e) => {
    if (!letterOpened) {
      openLetter();
    }
  });
  
  // Screen 6
  document.querySelectorAll('.photo-frame').forEach(frame => {
    frame.addEventListener('click', openLightbox);
  });
  document.getElementById('close-lightbox')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.getElementById('back-gallery')?.addEventListener('click', () => {
    // Go back to previous context if needed - just stay on screen 6
  });
  
  // Screen 7
  document.getElementById('next-7')?.addEventListener('click', () => {
    stopConfetti();
    goToNextScreen();
  });
  
  // Screen 8
  document.getElementById('replay-btn')?.addEventListener('click', replay);
  
  // Next buttons
  for (let i = 1; i <= 7; i++) {
    const btn = document.getElementById(`next-${i}`);
    if (btn) {
      btn.addEventListener('click', goToNextScreen);
    }
  }
  
  // Mute toggle
  muteToggle.addEventListener('click', toggleMute);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === ' ' && currentScreen === 4) {
      e.preventDefault();
      togglePlayPause();
    }
  });
}

// ===== SCREEN NAVIGATION =====
function showScreen(screenNumber) {
  screens.forEach(screen => screen.classList.remove('active'));
  const targetScreen = document.getElementById(`screen-${screenNumber}`);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
  currentScreen = screenNumber;
  
  // Handle screen-specific logic
  handleScreenEnter(screenNumber);
}

function goToNextScreen() {
  if (currentScreen < totalScreens) {
    showScreen(currentScreen + 1);
  }
}

function handleScreenEnter(screenNum) {
  switch (screenNum) {
    case 1:
      enteredPassword = '';
      updatePasswordDots();
      break;
    case 2:
      // Reset NO button position
      const noBtn = document.getElementById('no-btn');
      if (noBtn) {
        noBtn.style.position = 'static';
        noBtn.style.transform = 'none';
      }
      break;
    case 3:
      bouquetOpened = [false, false, false];
      document.querySelectorAll('.bouquet-note').forEach(note => {
        note.classList.add('hidden');
      });
      document.querySelectorAll('.bouquet').forEach(b => b.classList.remove('bloom'));
      break;
    case 5:
      letterOpened = false;
      const envelope = document.getElementById('envelope');
      const seal = document.getElementById('wax-seal');
      if (envelope) envelope.classList.remove('open');
      if (seal) {
        seal.classList.remove('opened');
        seal.style.pointerEvents = 'auto';
      }
      clearInterval(typingInterval);
      document.getElementById('letter-text').innerHTML = '';
      break;
    case 7:
      startConfetti();
      break;
    case 8:
      // Stop music if playing
      if (audio && isPlaying) {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
      }
      break;
  }
}

// ===== SCREEN 1 - PASSWORD =====
function handleKeypadPress(e) {
  const key = e.target.dataset.key;
  if (key && enteredPassword.length < 4) {
    enteredPassword += key;
    updatePasswordDots();
    
    if (enteredPassword.length === 4) {
      checkPassword();
    }
  }
}

function updatePasswordDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    if (index < enteredPassword.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

function checkPassword() {
  if (enteredPassword === correctPassword) {
    // Correct password
    setTimeout(() => {
      document.getElementById('next-1').classList.remove('hidden');
      goToNextScreen();
    }, 300);
  } else {
    // Wrong password - shake dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.classList.add('shake');
      setTimeout(() => dot.classList.remove('shake'), 500);
    });
    setTimeout(() => {
      clearPassword();
    }, 500);
  }
}

function clearPassword() {
  enteredPassword = '';
  updatePasswordDots();
}

// ===== SCREEN 2 - INTRO =====
function runAwayButton(e) {
  const btn = e.target;
  const screen = document.getElementById('screen-2');
  const screenRect = screen.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  
  // Calculate max distance to keep button inside screen
  const maxX = screenRect.width - btnRect.width - 20;
  const maxY = screenRect.height - btnRect.height - 20;
  
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;
  
  btn.style.position = 'absolute';
  btn.style.left = randomX + 'px';
  btn.style.top = randomY + 'px';
  btn.style.transform = 'none';
  
  // Add slight wiggle
  btn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
}

// ===== SCREEN 3 - BOUQUET =====
function handleBouquetClick(e) {
  const item = e.currentTarget;
  const bouquetIndex = parseInt(item.dataset.bouquet);
  
  if (!bouquetOpened[bouquetIndex]) {
    bouquetOpened[bouquetIndex] = true;
    
    // Bloom animation
    const bouquet = item.querySelector('.bouquet');
    bouquet.classList.add('bloom');
    
    // Show note
    const note = item.querySelector('.bouquet-note');
    setTimeout(() => {
      note.classList.remove('hidden');
    }, 300);
    
    // Check if all opened
    if (bouquetOpened.every(opened => opened)) {
      setTimeout(() => {
        document.getElementById('next-3').classList.remove('hidden');
      }, 1000);
    }
  }
}

// ===== SCREEN 4 - MUSIC =====
function initializeAudio() {
  audio = new Audio();
  audio.src = CONFIG.music.filePath;
  audio.preload = 'metadata';
  
  audio.addEventListener('loadedmetadata', () => {
    const totalTimeEl = document.getElementById('total-time');
    if (totalTimeEl) {
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  });
  
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', handleTrackEnd);
  audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
    document.querySelector('.vinyl-disc')?.classList.add('playing');
  });
  audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
    document.querySelector('.vinyl-disc')?.classList.remove('playing');
  });
}

function togglePlayPause() {
  if (!audio) return;
  
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(err => {
      console.log('Audio play failed:', err);
    });
  }
}

function updatePlayButton() {
  const playBtn = document.getElementById('play-btn');
  if (playBtn) {
    playBtn.textContent = isPlaying ? '⏸' : '▶';
  }
}

function updateProgress() {
  if (!audio || isNaN(audio.duration)) return;
  
  const progress = (audio.currentTime / audio.duration) * 100;
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) {
    progressFill.style.width = progress + '%';
  }
  
  const currentTimeEl = document.getElementById('current-time');
  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
}

function seekMusic(e) {
  if (!audio || isNaN(audio.duration)) return;
  
  const progressBar = e.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const seekTime = (clickX / width) * audio.duration;
  
  audio.currentTime = seekTime;
}

function prevTrack() {
  // Single track - just restart
  if (audio) {
    audio.currentTime = 0;
    if (!isPlaying) togglePlayPause();
  }
}

function nextTrack() {
  // Single track - just restart
  if (audio) {
    audio.currentTime = 0;
    if (!isPlaying) togglePlayPause();
  }
}

function handleTrackEnd() {
  isPlaying = false;
  audio.currentTime = 0;
  updatePlayButton();
  document.querySelector('.vinyl-disc')?.classList.remove('playing');
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function toggleMute() {
  musicMuted = !musicMuted;
  if (audio) {
    audio.muted = musicMuted;
  }
  muteIcon.textContent = musicMuted ? '🔇' : '🔊';
}

// ===== SCREEN 5 - LETTER =====
function openLetter() {
  if (letterOpened) return;
  letterOpened = true;
  
  const envelope = document.getElementById('envelope');
  const seal = document.getElementById('wax-seal');
  
  envelope.classList.add('open');
  seal.classList.add('opened');
  seal.style.pointerEvents = 'none';
  
  // Start typing effect
  setTimeout(() => {
    typeLetter();
  }, 800);
}

function typeLetter() {
  const letterTextEl = document.getElementById('letter-text');
  const text = CONFIG.letterText;
  let index = 0;
  
  // Replace [NAME] and [MY_NAME] with actual names
  const formattedText = text
    .replace(/\[NAME\]/g, CONFIG.hisName)
    .replace(/\[MY_NAME\]/g, CONFIG.myName);
  
  letterTextEl.innerHTML = '';
  
  typingInterval = setInterval(() => {
    if (index < formattedText.length) {
      letterTextEl.innerHTML = formattedText.substring(0, index + 1) + '<span class="cursor">|</span>';
      index++;
      // Auto-scroll
      const letterPaper = document.querySelector('.letter-paper');
      if (letterPaper) {
        letterPaper.scrollTop = letterPaper.scrollHeight;
      }
    } else {
      clearInterval(typingInterval);
      letterTextEl.innerHTML = formattedText;
      // Show next button
      setTimeout(() => {
        document.getElementById('next-5').classList.remove('hidden');
      }, 500);
    }
  }, 30); // Typing speed
}

// ===== SCREEN 6 - GALLERY =====
function openLightbox(e) {
  const frame = e.currentTarget;
  const photoIndex = frame.dataset.photo;
  const imgSrc = CONFIG.galleryPhotos[photoIndex];
  
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  lightboxImg.src = imgSrc;
  lightbox.classList.add('active');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
}

// ===== SCREEN 7 - CONFETTI =====
function startConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  
  const colors = ['#ffd93b', '#ff9ec7', '#7bed9f', '#74b9ff', '#a29bfe'];
  
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      colors: colors
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
  
  // Burst of confetti in middle
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors
    });
  }, 500);
}

function stopConfetti() {
  // Confetti auto-stops, but reset if needed
}

// ===== SCREEN 8 - REPLAY =====
function replay() {
  // Reset all states and go to screen 2
  bouquetOpened = [false, false, false];
  letterOpened = false;
  clearInterval(typingInterval);
  
  // Hide next buttons as needed
  for (let i = 1; i < 7; i++) {
    const btn = document.getElementById(`next-${i}`);
    if (btn) btn.classList.add('hidden');
  }
  
  // Stop audio
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    updatePlayButton();
    document.querySelector('.vinyl-disc')?.classList.remove('playing');
  }
  
  showScreen(2);
}

// ===== BACKGROUND PARTICLES =====
function startParticles() {
  if (particlesInterval) clearInterval(particlesInterval);
  
  particlesInterval = setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.animationDelay = Math.random() * 0.5 + 's';
    particlesContainer.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
      heart.remove();
    }, 8000);
  }, 400);
}

function startStars() {
  if (starsInterval) clearInterval(starsInterval);
  
  starsInterval = setInterval(() => {
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.textContent = '✨';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.animationDuration = (Math.random() * 3 + 7) + 's';
    starsContainer.appendChild(star);
    
    setTimeout(() => {
      star.remove();
    }, 10000);
  }, 600);
}
