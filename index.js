const btn = document.querySelector('#play');

const tempo = 100;

const notes = [
  [659, 4],
  [659, 4],
  [659, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4],
  [0, 4],
  [987, 4],
  [987, 4],
  [987, 4],
  [1046, 8],
  [0, 16],
  [783, 16],
  [622, 4],
  [523, 8],
  [0, 16],
  [783, 16],
  [659, 4]
];

notes.reverse(); // reverse so we can use pop instead of shift for perf reasons probs

btn.addEventListener('mousedown', () => {
  playMelody();
});

function playMelody() {
  if (notes.length > 0) {
    note = notes.pop();
    playNote(note[0], 256/(note[1]*tempo), playMelody);
  }
}

// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////

function playNote(frequency, duration, callback) {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  /** @type OscillatorNode */
  const oscillator = audioCtx.createOscillator();

  oscillator.type = 'square';
  oscillator.frequency.value = frequency;

  //set up the different audio nodes we will use for the app
  var analyser = audioCtx.createAnalyser();
  var distortion = audioCtx.createWaveShaper();
  var gainNode = audioCtx.createGain();
  var biquadFilter = audioCtx.createBiquadFilter();
  var convolver = audioCtx.createConvolver();

  // connect the nodes together
  oscillator.connect(analyser);
  analyser.connect(distortion);
  distortion.connect(biquadFilter);
  biquadFilter.connect(convolver);
  convolver.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Create an impulse response and set up the convolver
  const impulseBuffer = impulseResponse(audioCtx, 4, 4, false);
  // The convolver is going to give us the mega reverb
  convolver.buffer = impulseBuffer;

  // Manipulate the Biquad filter

  biquadFilter.type = "lowpass";
  biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
  biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
  oscillator.onended = callback;
}

/**
 * It's in stereo too!
 *
 * Thanks to https://stackoverflow.com/users/1789439/cwilso
 * @see https://stackoverflow.com/questions/22525934/connecting-convolvernode-to-an-oscillatornode-with-the-web-audio-the-simple-wa
 *
 * @param {AudioContext} audioCtx
 * @param {number} duration
 * @param {number} decay
 * @param {boolean} reverse
 * @returns {AudioBuffer}
 */
function impulseResponse( audioCtx, duration, decay, reverse ) {
  const sampleRate = audioCtx.sampleRate;
  const length = sampleRate * duration;
  const impulse = audioCtx.createBuffer(2, length, sampleRate);
  const impulseL = impulse.getChannelData(0);
  const impulseR = impulse.getChannelData(1);

  if (!decay) {
    decay = 2.0;
  }

  for (let i = 0; i < length; i += 1) {
    const n = reverse ? length - i : i;

    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }

  return impulse;
}
