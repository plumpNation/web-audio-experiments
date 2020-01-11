import { store } from './rootReducer'
import { impulseResponse } from './synth/helpers'

const audioCtx = new window.AudioContext()

// set up the different audio nodes we will use for the app
var analyser = audioCtx.createAnalyser()
var distortion = audioCtx.createWaveShaper()
var gainNode = audioCtx.createGain()
var biquadFilter = audioCtx.createBiquadFilter()
var convolver = audioCtx.createConvolver()

// Create an impulse response and set up the convolver
const impulseBuffer = impulseResponse(audioCtx, 4, 4, false)
// The convolver is going to give us the mega reverb
convolver.buffer = impulseBuffer

// Manipulate the Biquad filter

biquadFilter.type = 'lowpass'
biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime)
biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime)

const playNote = ({ frequency, velocity }) => {
  /** @type OscillatorNode */
  const oscillator = audioCtx.createOscillator()

  oscillator.type = 'square'
  oscillator.frequency.value = frequency

  // connect the nodes together
  oscillator.connect(analyser)
  analyser.connect(distortion)
  distortion.connect(biquadFilter)
  biquadFilter.connect(convolver)
  convolver.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  gainNode.gain.setValueAtTime(velocity * 0.01, audioCtx.currentTime)
  convolver.normalize = true

  oscillator.start()

  return oscillator
}

const currentOscillators = {}

store.subscribe(() => {
  const activeNotes = store.getState().activeNotes
  const activeKeys = Object.keys(activeNotes)
  const currentKeys = Object.keys(currentOscillators)

  const allKeys = [...new Set(
    activeKeys.concat(currentKeys)
  )]

  allKeys.forEach(key => {
    // activeKeys will not include the notes that are current but now released
    if (!activeNotes[key]) {
      currentOscillators[key] && currentOscillators[key].stop()
      currentOscillators[key] = null
    } else {
      currentOscillators[key] = playNote(activeNotes[key])
    }
  })

  console.log(currentOscillators)
})
