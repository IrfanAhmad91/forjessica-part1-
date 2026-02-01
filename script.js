// ===================================
// CONFIGURATION
// ===================================
const CONFIG = {
    SEGMENT_DURATION: 5000,      // 5 seconds per segment
    FADE_IN_DURATION: 1000,      // 1 second fade in
    FADE_OUT_DURATION: 1000,     // 1 second fade out
    BUTTON_DELAY: 22000,         // 22 seconds after full text appears
    WORDS_PER_SEGMENT: 3         // 3 words per segment
};

// ===================================
// ORIGINAL TEXT
// ===================================
const FULL_TEXT = `Mungkin pertemuan kita terlalu singkat, tapi entah kenapa semenjak bertemu denganmu, hari-hariku sedikit lebih berwarna dari biasanya. Mungkin ini juga jawaban dari doa-doa yang telah dipanjatkan dan akhirnya bisa ketemu melalui Telegram (Leomatch). Sengaja aku sampaikan lewat sini, karena kadang ada hal yang lebih nyaman diungkapkan lewat tulisan daripada sekadar ucapan.`;

// ===================================
// DOM ELEMENTS
// ===================================
const elements = {
    animatedText: document.getElementById('animatedText'),
    fullText: document.getElementById('fullText'),
    funnyButton: document.getElementById('funnyButton'),
    bgMusic: document.getElementById('bgMusic'),
    playPrompt: document.getElementById('playPrompt'),
    playButton: document.getElementById('playButton')
};

// ===================================
// STATE
// ===================================
let currentSegmentIndex = 0;
let textSegments = [];
let animationTimeout = null;

// ===================================
// TEXT SEGMENTATION
// ===================================
function createTextSegments(text) {
    // Split text into words
    const words = text.split(' ');
    const segments = [];
    
    // Group words into segments of 3
    for (let i = 0; i < words.length; i += CONFIG.WORDS_PER_SEGMENT) {
        const segment = words.slice(i, i + CONFIG.WORDS_PER_SEGMENT).join(' ');
        segments.push(segment);
    }
    
    return segments;
}

// ===================================
// AUDIO MANAGEMENT
// ===================================
function attemptAutoplay() {
    const playPromise = elements.bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Autoplay successful, hide play prompt
                console.log('Autoplay started successfully');
                hidePlayPrompt();
            })
            .catch((error) => {
                // Autoplay blocked, show play prompt
                console.log('Autoplay blocked, showing play button');
                showPlayPrompt();
            });
    }
}

function showPlayPrompt() {
    elements.playPrompt.classList.remove('hidden');
}

function hidePlayPrompt() {
    elements.playPrompt.classList.add('hidden');
}

function startMusic() {
    elements.bgMusic.play()
        .then(() => {
            console.log('Music started by user interaction');
            hidePlayPrompt();
            startAnimation();
        })
        .catch((error) => {
            console.error('Error playing music:', error);
        });
}

// ===================================
// ANIMATION FUNCTIONS
// ===================================
function showSegment(segment) {
    elements.animatedText.textContent = segment;
    elements.animatedText.classList.remove('fade-out');
    elements.animatedText.classList.add('fade-in');
}

function hideSegment() {
    elements.animatedText.classList.remove('fade-in');
    elements.animatedText.classList.add('fade-out');
}

function animateNextSegment() {
    if (currentSegmentIndex >= textSegments.length) {
        // All segments shown, move to Phase 2
        showFullText();
        return;
    }
    
    const currentSegment = textSegments[currentSegmentIndex];
    
    // Show segment with fade in
    showSegment(currentSegment);
    
    // After display time, fade out
    animationTimeout = setTimeout(() => {
        hideSegment();
        
        // After fade out, move to next segment
        animationTimeout = setTimeout(() => {
            currentSegmentIndex++;
            animateNextSegment();
        }, CONFIG.FADE_OUT_DURATION);
        
    }, CONFIG.SEGMENT_DURATION - CONFIG.FADE_OUT_DURATION);
}

function startAnimation() {
    currentSegmentIndex = 0;
    animateNextSegment();
}

// ===================================
// PHASE 2: FULL TEXT DISPLAY
// ===================================
function showFullText() {
    // Hide animated text container
    elements.animatedText.style.display = 'none';
    
    // Show full text
    elements.fullText.classList.remove('hidden');
    
    // Trigger show animation with slight delay
    setTimeout(() => {
        elements.fullText.classList.add('show');
    }, 100);
    
    // Show button after delay
    showFunnyButton();
}

// ===================================
// PHASE 3: BUTTON APPEARANCE
// ===================================
function showFunnyButton() {
    setTimeout(() => {
        elements.funnyButton.classList.remove('hidden');
        
        // Trigger show animation with slight delay
        setTimeout(() => {
            elements.funnyButton.classList.add('show');
        }, 100);
    }, CONFIG.BUTTON_DELAY);
}

// ===================================
// EVENT LISTENERS
// ===================================
elements.playButton.addEventListener('click', () => {
    startMusic();
});

// Optional: Click anywhere to start if autoplay fails
document.body.addEventListener('click', (e) => {
    if (!elements.playPrompt.classList.contains('hidden') && 
        e.target !== elements.playButton) {
        startMusic();
    }
}, { once: true });

// ===================================
// INITIALIZATION
// ===================================
function init() {
    // Create text segments
    textSegments = createTextSegments(FULL_TEXT);
    console.log(`Created ${textSegments.length} text segments`);
    
    // Attempt autoplay
    attemptAutoplay();
    
    // If autoplay succeeds, start animation immediately
    elements.bgMusic.addEventListener('play', () => {
        if (currentSegmentIndex === 0 && !elements.animatedText.classList.contains('fade-in')) {
            startAnimation();
        }
    }, { once: true });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
