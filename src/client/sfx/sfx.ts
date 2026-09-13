import { tab } from "rokay/data/array"
import { float } from "rokay/math/random"


export type SfxCore = {
  attack: number
  decay: number
  gain: number
  pitchIndex?: number
  pitchSlide: number
  release: number
  sustain: number
  sustainTime?: number
  wave: (p: number) => number
}

export type Wave = WaveNoise | WaveSawtooth | WaveSine | WaveSquare | WaveTriangle
export type WaveNoise = { t: "noise" }
export type WaveSawtooth = {
  t: "sawtooth"
  duty: number
}
export type WaveSine = { t: "sine" }
export type WaveSquare = {
  t: "square"
  duty: number
}
export type WaveTriangle = { t: "triangle" }


export const
  getWave = (wave: Wave): (p: number) => number =>
    wave.t === "noise" ?
      noiseWave()
    : wave.t === "sawtooth" ?
      (p) => p > wave.duty ? 1 : 2 * (p / wave.duty) - 1
    : wave.t === "sine" ?
      sineWave
    : wave.t === "square" ?
      (p) => p < wave.duty ? -1 : 1
    :
      triangleWave,

  noiseWave = () => {
    const NUM_SAMPLES = 32
    let
      lastP = 0,
      samples = tab(NUM_SAMPLES, () => float(-1, 1))

    return (p: number) => {
      if (p < lastP) { samples = tab(NUM_SAMPLES, () => float(-1, 1)) } //(random.int(0, 15) - 8) / 8)
      return samples[Math.floor((lastP = p) * samples.length)]
    }
  },

  sawtoothWave = (duty: number) =>
    (p: number) => p > duty ? 1 : 2 * (p / duty) - 1,

  PI_2 = Math.PI * 2,
  sineWave = (p: number) =>
    Math.sin(p * PI_2),

  squareWave = (duty: number) =>
    (p: number) => p < duty ? -1 : 1,

  triangleWave = (p: number) =>
    Math.min(4 * p - 1, 3 - 4 * p)

export const
  ctx = new AudioContext(),

  applySFX = (
    data: Float32Array,
    attack: number,
    decay: number,
    gain: number,
    pitchIndex: number,
    pitchSlide: number,
    release: number,
    sustain: number,
    sustainTime: number,
    wave: (p: number) => number,

    sampleRate = ctx.sampleRate,
    start = 0,
    limit = Infinity,
  ) => {
    const
      attackSamples = Math.round(attack * sampleRate),
      decaySamples = Math.round(decay * sampleRate),
      sustainSamples = Math.round(sustainTime * sampleRate),
      releaseSamples = Math.round(release * sampleRate),

      noReleaseSamples = attackSamples + decaySamples + sustainSamples,

      L = Math.min(noReleaseSamples + releaseSamples, limit, data.length - start)

    let phase = 0

    for (let i = 0; i < L; ++i) {
      const
        freq = Math.pow(2, (pitchIndex - 49) / 12) * 440,
        period = 1 / freq * sampleRate,
        iPeriod = Math.round(period),

        float = wave(phase / iPeriod),
        ramped = i < attackSamples ?
            float * i / attackSamples
          : i < attackSamples + decaySamples ?
            ((k: number) => (1 - k) * float + k * float * sustain)(
              (i - attackSamples) / decaySamples,
            )
          : i < noReleaseSamples ?
            float * sustain
          :
            (1 - (i - noReleaseSamples) / releaseSamples) * float * sustain,
        val = Math.floor((ramped + 1) * 128)
      data[start + i] += gain * ((val > 255 ? 255 : val) / 127.5 - 1)
      phase = (phase + 1) % iPeriod

      pitchIndex += pitchSlide
    }
  },

  generateSFXBuffer = (
    attack: number,
    decay: number,
    gain: number,
    pitchIndex: number,
    pitchSlide: number,
    release: number,
    sustain: number,
    sustainTime: number,
    wave: (p: number) => number,
    sampleRate = ctx.sampleRate,
  ) => {
    const
      buffer = new AudioBuffer({
        numberOfChannels: 1,
        length: Math.round((attack + decay + sustainTime + release) * sampleRate),
        sampleRate,
      }),
      data = buffer.getChannelData(0)

    applySFX(
      data,
      attack,
      decay,
      gain,
      pitchIndex,
      pitchSlide,
      release,
      sustain,
      sustainTime,
      wave,
      sampleRate = 48_000,
    )

    return buffer
  },

  playBuffer = (buffer: AudioBuffer, options?: AudioBufferSourceOptions) => {
    const source = new AudioBufferSourceNode(ctx, { buffer, ...options })
    source.connect(new GainNode(ctx, { gain: .0625 })).connect(ctx.destination)
    ctx.resume().then(() => {
      // source.connect(ctx.destination)
      source.start()
    })
    return () => source.stop()
  },

  apply = (buffer: AudioBuffer, i: number, note: AudioBuffer) => {
    const
      data = buffer.getChannelData(0),
      noteData = note.getChannelData(0)
    data.set(noteData.slice(0, Math.min(noteData.length, data.length - i)))
    return data
  },

  trim = (buffer: AudioBuffer) => {
    const data = buffer.getChannelData(0)
    let end = data.length
    while (end > 0 && data[end - 1] === 0) {
      --end
    }
    const result = new AudioBuffer({ length: end, sampleRate: ctx.sampleRate })
    result.getChannelData(0).set(data.slice(0, end))
    return result
  }
