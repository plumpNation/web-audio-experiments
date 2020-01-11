import { store } from './rootReducer'
import { noteOn, noteOff, addDevice } from './MIDI/state'

import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  frequencyFromMIDINote,
  normalizeMIDIMessage,
  checkMIDICapability,
  onMIDIFailure
} from './MIDI/helpers'

import {
  NOTE_OFF,
  NOTE_ON
} from './MIDI/codes'

checkMIDICapability()

navigator.requestMIDIAccess()
  .then(onMIDISuccess)
  .catch(onMIDIFailure)

// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////

function onMIDISuccess (MIDIAccess) {
  const { inputs } = MIDIAccess

  /** @type MIDIInput[] */
  const inputDevices = inputs.values()

  for (const inputDevice of inputDevices) {
    console.log({ inputDevice })

    try {
      store.dispatch(addDevice(inputDevice))
    } catch (err) {
      console.error(err)
    }

    observeInputDevice(inputDevice)
  }
}

/**
 * Wrap up the MIDI events with rxjs.
 *
 * @param {MIDIInput} inputDevice
 */
function observeInputDevice (inputDevice) {
  fromEvent(inputDevice, 'midimessage')
    .pipe(map(normalizeMIDIMessage))
    .subscribe(doTheThingWithTheMessage)
}

function doTheThingWithTheMessage (MIDIMessage) {
  const [command, note, velocity] = MIDIMessage

  console.log(MIDIMessage)

  switch (command) {
    case NOTE_ON:
      const frequency = frequencyFromMIDINote(note)

      store.dispatch(noteOn({ note, frequency, velocity }))

      break;

    case NOTE_OFF:
      store.dispatch(noteOff(note))

      break;
  }
}
