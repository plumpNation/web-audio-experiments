import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { activeNotesReducer, midiDevicesReducer } from './MIDI/state';

const rootReducer = combineReducers({
  activeNotes: activeNotesReducer,
  midiDevices: midiDevicesReducer,
});

export const store = createStore(rootReducer, composeWithDevTools());
