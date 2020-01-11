import { omit, add } from '../state/helpers'
import { createDeviceId, adaptMIDIInput } from './helpers'

export const MIDI_NOTE_ON = 'MIDI_NOTE_ON'
export const MIDI_NOTE_OFF = 'MIDI_NOTE_OFF'

export const MIDI_ADD_DEVICE = 'MIDI_ADD_DEVICE'

// /////////////////////////////////////////////////////////////////////////////

/**
 * @param {{[note: string]: {frequency: number, velocity: number}}} state
 * @param {{payload: {note: number, frequency: number, velocity: number}}} action
 * @returns {{[note: string]: {frequency: number, velocity: number}}}
 */
export const activeNotesReducer = (state = {}, action) => {
  switch (action.type) {
    case MIDI_NOTE_ON: {
      const { note } = action.payload

      return add(note, action.payload)(state)
    };

    case MIDI_NOTE_OFF: {
      const { payload: note } = action

      return omit(note)(state)
    };

    default:
      return state
  }
}

/**
 * @param {{[note: string]: MIDIInput}} state
 * @param {{type: string, payload: MIDIInput}} action
 * @returns {{[note: string]: MIDIInput}}
 */
export const midiDevicesReducer = (state = {}, action) => {
  switch (action.type) {
    case MIDI_ADD_DEVICE: {
      const { payload } = action

      return add(createDeviceId(payload), adaptMIDIInput(payload))(state)
    };

    default:
      return state
  }
}

// /////////////////////////////////////////////////////////////////////////////

/**
 * @param {{note: number, frequency: number, velocity: number}} payload
 * @returns {{type: string, payload: {note: number, frequency: number, velocity: number}}}
 */
export const noteOn = (payload) => ({
  type: MIDI_NOTE_ON,
  payload
})

/**
 * @param {number} note
 * @returns {{type: string, payload: number}}
 */
export const noteOff = (note) => ({
  type: MIDI_NOTE_OFF,
  payload: note
})

/**
 *
 * @param {MIDIInput} device
 * @returns {{type: string, payload: MIDIInput}}
 */
export const addDevice = (device) => ({
  type: MIDI_ADD_DEVICE,
  payload: device
})
