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
export const impulseResponse = (audioCtx, duration, decay, reverse) => {
  const sampleRate = audioCtx.sampleRate
  const length = sampleRate * duration
  const impulse = audioCtx.createBuffer(2, length, sampleRate)
  const impulseL = impulse.getChannelData(0)
  const impulseR = impulse.getChannelData(1)

  if (!decay) {
    decay = 2.0
  }

  for (let i = 0; i < length; i += 1) {
    const n = reverse ? length - i : i

    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
  }

  return impulse
}
