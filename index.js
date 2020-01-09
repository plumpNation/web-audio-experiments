const btn = document.querySelector('#play');

btn.addEventListener('click', () => {
  runThatBadBody();
});

function runThatBadBody() {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  /** @type OscillatorNode */
  const oscillator = audioCtx.createOscillator();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);

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
  biquadFilter.frequency.setValueAtTime(200, audioCtx.currentTime + 2);
  biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);

  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
  }, 3000);
}


function impulseResponse( audioCtx, duration, decay, reverse ) {
  var sampleRate = audioCtx.sampleRate;
  var length = sampleRate * duration;
  var impulse = audioCtx.createBuffer(2, length, sampleRate);
  var impulseL = impulse.getChannelData(0);
  var impulseR = impulse.getChannelData(1);

  if (!decay)
      decay = 2.0;
  for (var i = 0; i < length; i++){
    var n = reverse ? length - i : i;
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }
  return impulse;
}
