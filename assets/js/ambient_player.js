/**
 * Ambient Player - Lo-fi hip hop style with varied instruments
 * Creates a chill, atmospheric soundscape from user's melody
 */

(function() {
  'use strict';

  if (typeof Tone === 'undefined') {
    console.warn('Tone.js not loaded, ambient player disabled');
    return;
  }

  const STORAGE_KEY = 'miniPianoLoop';
  const STATE_KEY = 'miniPianoState';

  // Tempo and timing
  const BPM = 70;  // Lo-fi is usually slow
  const MELODY_INTERVAL = '2n';  // Half notes for main melody

  // State
  let instruments = {};
  let effects = {};
  let loops = [];
  let isMuted = false;
  let currentNotes = [];

  const muteButton = document.getElementById('piano-mute-button');

  /**
   * Initialize all instruments and effects
   */
  async function initAmbient() {
    try {
      Tone.Transport.bpm.value = BPM;

      // === EFFECTS ===

      // Main reverb (large space)
      effects.reverb = new Tone.Reverb({
        decay: 5,
        wet: 0.5
      }).toDestination();

      // Tape-style delay
      effects.delay = new Tone.FeedbackDelay({
        delayTime: '4n.',
        feedback: 0.25,
        wet: 0.2
      }).connect(effects.reverb);

      // Lo-fi filter (warm, cut highs)
      effects.lofi = new Tone.Filter({
        frequency: 2500,
        type: 'lowpass',
        rolloff: -24
      }).connect(effects.delay);

      // Chorus for warmth
      effects.chorus = new Tone.Chorus({
        frequency: 0.5,
        delayTime: 3.5,
        depth: 0.6,
        wet: 0.3
      }).connect(effects.lofi);
      effects.chorus.start();

      // Bitcrusher for lo-fi grit (subtle)
      effects.crusher = new Tone.BitCrusher({
        bits: 12
      }).connect(effects.chorus);

      await effects.reverb.ready;

      // === INSTRUMENTS ===

      // 1. Rhodes/Electric Piano - main melody
      instruments.rhodes = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3,
        modulationIndex: 1,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.4,
          sustain: 0.3,
          release: 1.2
        },
        modulation: { type: 'sine' },
        modulationEnvelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.2,
          release: 0.5
        }
      }).connect(effects.crusher);
      instruments.rhodes.volume.value = -10;

      // 2. Warm Pad - slow chords
      instruments.pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: {
          attack: 1.5,
          decay: 1,
          sustain: 0.8,
          release: 3
        }
      }).connect(effects.lofi);
      instruments.pad.volume.value = -18;

      // 3. Muted Bass - deep foundation
      instruments.bass = new Tone.MonoSynth({
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.05,
          decay: 0.3,
          sustain: 0.4,
          release: 0.8
        },
        filterEnvelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.2,
          release: 0.5,
          baseFrequency: 200,
          octaves: 2
        }
      }).connect(effects.lofi);
      instruments.bass.volume.value = -12;

      // 4. Pluck/Guitar - off-beat accents
      instruments.pluck = new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 2000,
        resonance: 0.95
      }).connect(effects.delay);
      instruments.pluck.volume.value = -14;

      // 5. Glockenspiel/Bells - high shimmer
      instruments.bells = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 1.5,
          sustain: 0,
          release: 1.5
        }
      }).connect(effects.reverb);
      instruments.bells.volume.value = -20;

      // 6. Soft Kick
      instruments.kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.25,
          sustain: 0,
          release: 0.4
        }
      }).connect(effects.lofi);
      instruments.kick.volume.value = -16;

      // 7. Brush/Shaker
      instruments.shaker = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0,
          release: 0.05
        }
      }).connect(effects.lofi);
      instruments.shaker.volume.value = -28;

      // 8. Rim shot
      instruments.rim = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: 0.05,
          sustain: 0,
          release: 0.02
        }
      }).connect(effects.lofi);
      instruments.rim.volume.value = -22;

      // 9. Vinyl crackle
      instruments.vinyl = new Tone.Noise('brown').connect(effects.lofi);
      instruments.vinyl.volume.value = -36;

      // 10. Ambient texture (filtered noise pad)
      instruments.texture = new Tone.Noise('pink');
      effects.textureFilter = new Tone.AutoFilter({
        frequency: 0.05,
        baseFrequency: 200,
        octaves: 2
      }).connect(effects.reverb);
      effects.textureFilter.start();
      instruments.texture.connect(effects.textureFilter);
      instruments.texture.volume.value = -32;

      console.log('Lo-fi ambient player initialized');
    } catch (error) {
      console.error('Failed to initialize ambient:', error);
    }
  }

  function loadNoteHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data).notes;
    } catch (e) { return null; }
  }

  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        isMuted, isPlaying: loops.length > 0
      }));
    } catch (e) {}
  }

  function loadState() {
    try {
      const data = localStorage.getItem(STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  }

  /**
   * Create all the loops
   */
  function createLoops(notes) {
    if (!notes || notes.length === 0) return;

    stopLoops();
    currentNotes = notes;

    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }

    // Start ambient textures
    instruments.vinyl.start();
    instruments.texture.start();

    // === MELODY LAYERS ===

    // Rhodes - main melody (on beat)
    let rhodesIdx = 0;
    const rhodesLoop = new Tone.Loop((time) => {
      if (isMuted) return;
      const note = `${currentNotes[rhodesIdx].note}4`;
      instruments.rhodes.triggerAttackRelease(note, '2n', time);
      rhodesIdx = (rhodesIdx + 1) % currentNotes.length;
    }, '2n');
    rhodesLoop.start(0);
    loops.push(rhodesLoop);

    // Pad - slow chord tones (off-beat, every 2 bars)
    let padIdx = 0;
    const padLoop = new Tone.Loop((time) => {
      if (isMuted) return;
      const root = currentNotes[padIdx].note;
      const third = currentNotes[(padIdx + 2) % currentNotes.length].note;
      instruments.pad.triggerAttackRelease([`${root}3`, `${third}3`], '1m', time);
      padIdx = (padIdx + 1) % currentNotes.length;
    }, '1m');
    padLoop.start('4n');  // Off-beat start
    loops.push(padLoop);

    // Bass - root notes (syncopated)
    let bassIdx = 0;
    const bassLoop = new Tone.Loop((time) => {
      if (isMuted) return;
      if (Math.random() > 0.2) {  // 80% play
        const note = `${currentNotes[bassIdx].note}2`;
        instruments.bass.triggerAttackRelease(note, '4n', time);
      }
      bassIdx = (bassIdx + 1) % currentNotes.length;
    }, '2n');
    bassLoop.start('8n');  // Slightly off
    loops.push(bassLoop);

    // Pluck - off-beat accents (random)
    let pluckIdx = 0;
    const pluckLoop = new Tone.Loop((time) => {
      if (isMuted) return;
      if (Math.random() < 0.3) {  // 30% chance
        const note = `${currentNotes[pluckIdx].note}${Math.random() < 0.5 ? 4 : 5}`;
        instruments.pluck.triggerAttack(note, time);
      }
      pluckIdx = (pluckIdx + 1) % currentNotes.length;
    }, '4n.');  // Dotted quarter - creates off-beat feel
    pluckLoop.start('8n.');
    loops.push(pluckLoop);

    // Bells - occasional shimmer (sparse)
    let bellsIdx = currentNotes.length - 1;  // Start backwards
    const bellsLoop = new Tone.Loop((time) => {
      if (isMuted) return;
      if (Math.random() < 0.15) {  // 15% chance
        const note = `${currentNotes[bellsIdx].note}6`;
        instruments.bells.triggerAttackRelease(note, '8n', time);
        bellsIdx--;
        if (bellsIdx < 0) bellsIdx = currentNotes.length - 1;
      }
    }, '4n');
    bellsLoop.start('2n');  // Offset
    loops.push(bellsLoop);

    // === DRUMS ===

    // Kick - laid back, not every beat
    let kickPattern = [1, 0, 0, 1, 0, 0, 1, 0];  // Sparse pattern
    let kickIdx = 0;
    const kickLoop = new Tone.Loop((time) => {
      if (isMuted) return;
      if (kickPattern[kickIdx] && Math.random() > 0.1) {
        instruments.kick.triggerAttackRelease('C1', '8n', time);
      }
      kickIdx = (kickIdx + 1) % kickPattern.length;
    }, '8n');
    kickLoop.start(0);
    loops.push(kickLoop);

    // Shaker - off-beat groove
    const shakerLoop = new Tone.Loop((time) => {
      if (isMuted) return;
      if (Math.random() < 0.5) {
        instruments.shaker.triggerAttackRelease('16n', time);
      }
    }, '8n.');  // Dotted 8th for swing feel
    shakerLoop.start('16n');
    loops.push(shakerLoop);

    // Rim - sparse accent
    const rimLoop = new Tone.Loop((time) => {
      if (isMuted) return;
      if (Math.random() < 0.2) {
        instruments.rim.triggerAttackRelease('32n', time);
      }
    }, '2n');
    rimLoop.start('4n.');  // Off-beat
    loops.push(rimLoop);

    console.log(`Lo-fi loops started with ${currentNotes.length} notes`);
    saveState();
  }

  function stopLoops() {
    loops.forEach(loop => {
      loop.stop();
      loop.dispose();
    });
    loops = [];

    if (instruments.vinyl) instruments.vinyl.stop();
    if (instruments.texture) instruments.texture.stop();
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (muteButton) {
      muteButton.classList.toggle('muted', isMuted);
      muteButton.innerHTML = isMuted ? '🔇' : '♪';
    }

    // Stop/start the continuous noise generators
    if (isMuted) {
      if (instruments.vinyl) instruments.vinyl.stop();
      if (instruments.texture) instruments.texture.stop();
    } else {
      if (instruments.vinyl) instruments.vinyl.start();
      if (instruments.texture) instruments.texture.start();
    }

    saveState();
    if (!isMuted && currentNotes.length > 0 && Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
  }

  function handleNotesUpdate() {
    const notes = loadNoteHistory();
    if (notes && notes.length > 0) {
      createLoops(notes);
    }
  }

  async function init() {
    await initAmbient();

    const savedState = loadState();
    if (savedState) {
      isMuted = savedState.isMuted || false;
      if (muteButton) {
        muteButton.classList.toggle('muted', isMuted);
        muteButton.innerHTML = isMuted ? '🔇' : '♪';
      }
    }

    if (muteButton) {
      muteButton.addEventListener('click', async () => {
        if (Tone.context.state !== 'running') {
          await Tone.context.resume();
        }
        toggleMute();
      });
    }

    window.addEventListener('pianoNotesUpdated', handleNotesUpdate);

    const notes = loadNoteHistory();
    if (notes && notes.length > 0) {
      const startOnInteraction = async () => {
        if (Tone.context.state !== 'running') {
          await Tone.context.resume();
        }
        createLoops(notes);
        // Remove all listeners
        ['click', 'keydown', 'scroll', 'touchstart', 'mousemove'].forEach(evt => {
          document.removeEventListener(evt, startOnInteraction);
        });
      };
      // Listen for any user interaction to resume
      ['click', 'keydown', 'scroll', 'touchstart', 'mousemove'].forEach(evt => {
        document.addEventListener(evt, startOnInteraction, { once: false });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ambientPlayer = {
    toggleMute,
    isMuted: () => isMuted,
    getCurrentNotes: () => currentNotes,
    restart: handleNotesUpdate
  };

})();
