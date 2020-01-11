import { NOTE_OFF, NOTE_ON } from './codes'

export const createDeviceId = ({ id, name }) => `${name}-${id}`

export const adaptMIDIInput = (MIDIInput) => ({
  id: MIDIInput.id,
  name: MIDIInput.name,
  connection: MIDIInput.connection,
  manufacturer: MIDIInput.manufacturer
})

export const checkMIDICapability = () => {
  if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!')
  } else {
    console.error('WebMIDI is not supported in this browser.')
  }
}

export const onMIDIFailure = () => {
  console.error('Could not access your MIDI devices.')
}

/**
 * Convert midi note number to a frequency to be used with an oscillator.
 *
 * @param {number} note
 * @returns {number}
 */
export const frequencyFromMIDINote = (note) =>
  440 * Math.pow(2, (note - 69) / 12)

/**
 * Messages can be different. I want them to be the same.
 *
 * @param {MIDIMessageEvent} midiEvent
 * @returns {[number, number, number]}
 */
export const normalizeMIDIMessage = (midiEvent) => {
  let [command, note, velocity] = midiEvent.data

  // a velocity value might not be included with a noteOff command
  velocity = velocity || 0

  if (!velocity && command === NOTE_ON) {
    command = NOTE_OFF
  }

  return [command, note, velocity]
}
