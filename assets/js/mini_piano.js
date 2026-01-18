/**
 * Mini Piano - Auto-looping ambient piano
 * Plays and loops the last 5 notes continuously
 */

(function() {
  'use strict';

  // Wait for Tone.js to load
  if (typeof Tone === 'undefined') {
    console.warn('Tone.js not loaded, mini piano disabled');
    return;
  }

  // Check if piano keyboard exists
  const pianoKeyboard = document.querySelector('.piano-keyboard');
  if (!pianoKeyboard) {
    console.log('Piano keyboard not found on this page');
    return;
  }

  // Constants
  const MAX_LOOP_NOTES = 5;
  const STORAGE_KEY = 'miniPianoLoop';

  // State
  let synth = null;
  let noteHistory = []; // Last 5 notes played
  let lastNoteTime = 0;

  // DOM Elements
  const keys = document.querySelectorAll('.piano-key');

  /**
   * Initialize Tone.js synth - soft bell-like sound
   */
  async function initSynth() {
    try {
      // Soft bell-like sound
      synth = new Tone.Synth({
        oscillator: {
          type: 'sine'  // Pure tone for bell-like quality
        },
        envelope: {
          attack: 0.002,   // Quick but not harsh
          decay: 0.8,      // Long decay like a bell
          sustain: 0.1,    // Low sustain
          release: 1.5     // Gentle fade out
        }
      }).toDestination();
      synth.volume.value = -6;  // Soft volume

      console.log('Piano synth initialized (bell)');
    } catch (error) {
      console.error('Failed to initialize synth:', error);
    }
  }

  /**
   * Play a note when key is pressed
   */
  async function playNote(note, octave = '4') {
    try {
      // Ensure Tone.js context is started
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      // Handle special C5 case
      const fullNote = note === 'C5' ? 'C5' : `${note}${octave}`;

      // Re-create synth if needed (ensures it works)
      if (!synth) {
        await initSynth();
      }

      console.log('Playing:', fullNote);

      // Play the note
      synth.triggerAttackRelease(fullNote, 0.5);

      // Add to note history for ambient looping
      addNoteToHistory(note === 'C5' ? 'C' : note);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  /**
   * Add note to history and save
   */
  function addNoteToHistory(note) {
    const now = Date.now();
    const timeSinceLastNote = now - lastNoteTime;
    lastNoteTime = now;

    // Add note with timing info
    noteHistory.push({
      note: note,
      time: now,
      deltaTime: timeSinceLastNote
    });

    // Keep only last 5 notes
    if (noteHistory.length > MAX_LOOP_NOTES) {
      noteHistory.shift();
    }

    // Save to localStorage
    saveNoteHistory();

    // Notify ambient player
    window.dispatchEvent(new CustomEvent('pianoNotesUpdated'));
  }

  /**
   * Save note history to localStorage
   */
  function saveNoteHistory() {
    try {
      const data = {
        version: 1,
        notes: noteHistory.map(n => ({
          note: n.note,
          deltaTime: n.deltaTime
        })),
        updatedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save note history:', error);
    }
  }

  /**
   * Visual feedback for key press
   */
  function activateKey(keyElement) {
    keyElement.classList.add('active');
    setTimeout(() => {
      keyElement.classList.remove('active');
    }, 200);
  }

  /**
   * Handle key click
   */
  async function handleKeyClick(event) {
    const keyEl = event.currentTarget;
    const note = keyEl.dataset.note;

    // Start audio context on first click if needed
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    await playNote(note);
    activateKey(keyEl);
  }

  /**
   * Handle keyboard press
   */
  async function handleKeyPress(event) {
    // Ignore if typing in an input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = event.key.toLowerCase();

    // Piano keys
    const keyEl = document.querySelector(`.piano-key[data-key="${key}"]`);
    if (keyEl) {
      // Start audio context on first keypress if needed
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      const note = keyEl.dataset.note;
      await playNote(note);
      activateKey(keyEl);
    }
  }

  /**
   * Initialize piano
   */
  async function init() {
    await initSynth();

    // Attach event listeners
    keys.forEach(key => {
      key.addEventListener('click', handleKeyClick);
    });

    document.addEventListener('keydown', handleKeyPress);

    console.log('Mini Piano initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for debugging
  window.miniPiano = {
    getNoteHistory: () => noteHistory
  };

})();
