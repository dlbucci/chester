import { applySFX, ctx, SfxCore } from "./sfx"


export type Key =
  | "A"
  | "A#/Bb"
  | "B"
  | "C"
  | "C#/Db"
  | "D"
  | "D#/Eb"
  | "E"
  | "F"
  | "F#/Gb"
  | "G"
  | "G#/Ab"
export type Scale = {
  name: ScaleType
  notes: (number)[] /* int */
}
export type ScaleType =
  | "Major"
  | "Minor"
  | "Dorian"
  | "Phrygian"
  | "Lydian"
  | "Mixolydian"
  | "Locrian"

export type Bars = BarsAuto | BarsManual
export type BarsAuto = { t: "auto" }
export type BarsManual = {
  t: "manual"
  bars: number /* int */
}
export type Note = {
  qBeatLength: number /* int */
  qBeatStart: number /* int */
  pitch: number /* int */
}
export type NotePattern = {
  bars: number /* int */
  notes: (Note)[]
}
export type Song = {
  bars?: number /* int */
  beatsPerBar: number /* int */
  beatsPerMinute: number /* int */
  name: string
  seed?: number /* int */
  status: "ACTIVE" | "DELETED"
  tracks: (Track)[]
  updated: string
}
export type SongRequest = {
  bars?: number /* int */
  beatsPerBar: number /* int */
  beatsPerMinute: number /* int */
  name: string
  seed?: number /* int */
  status?: "ACTIVE" | "DELETED"
  tracks: (Track)[]
  updated?: string
}
export type Track = {
  sections: (TrackSection)[]
  sfx: SfxCore
}
export type TrackSection = {
  pattern: NotePattern
  repeat?: number /* int */
  start: number /* int */
  type?: TrackType
}
export type TrackType = "MELODY" | "PERCUSSION"


export const
  generateSongBuffer = (
    { bars, beatsPerBar, beatsPerMinute, tracks }: {
      bars: number
      beatsPerBar: number
      beatsPerMinute: number
      tracks: Omit<Track, "name">[]
    },
  ) => {
    const
      beats = bars * beatsPerBar,
      qBeatsPerMinute = 4 * beatsPerMinute,
      samplesPerQBeat = Math.round(ctx.sampleRate * 60 / qBeatsPerMinute),
      samples = beats * samplesPerQBeat * 4,
      buffer = new AudioBuffer({ length: samples, sampleRate: ctx.sampleRate }),
      data = buffer.getChannelData(0)

    tracks.forEach(({ sections, sfx }) => {
      sections.forEach((section) => {
        // note the <=. We want this to run at least once
        for (let i = 0; i <= (section.repeat ?? 0); ++i) {
          if (section.type === "PERCUSSION") {
            applyPercussionNotes(
              data,
              beatsPerMinute,
              ctx.sampleRate,
              sfx,
              section.pattern.notes,
              (section.start + i * section.pattern.bars)
              * Math.round(ctx.sampleRate * 60 / (beatsPerMinute / beatsPerBar)),
              sfx.wave,
            )
          } else {
            applyNotes(
              data,
              beatsPerMinute,
              ctx.sampleRate,
              sfx,
              section.pattern.notes,
              (section.start + i * section.pattern.bars)
              * Math.round(ctx.sampleRate * 60 / (beatsPerMinute / beatsPerBar)),
              sfx.wave,
            )
          }
        }
      })
    })

    return buffer
  },

  /**
   * @param start the sample index of the buffer where the notes should start to be applied at
   **/
  applyNotes = (
    data: Float32Array,
    beatsPerMinute: number,
    sampleRate: number,
    sfx: SfxCore,
    notes: Note[],
    start: number,
    wave: (p: number) => number,
  ) => {
    const
      qBeatsPerMinute = 4 * beatsPerMinute,
      samplesPerQBeat = Math.round(sampleRate * 60 / qBeatsPerMinute)

    notes.forEach((note) => {
      const sustainTime = note.qBeatLength / 4 / beatsPerMinute * 60 - (sfx.attack + sfx.decay)
      applySFX(
        data,
        sfx.attack,
        sfx.decay,
        sfx.gain,
        note.pitch,
        sfx.pitchSlide,
        sfx.release,
        sfx.sustain,
        sustainTime,
        wave,

        sampleRate,
        start + note.qBeatStart * samplesPerQBeat,
        Math.round((sfx.attack + sfx.decay + sustainTime + sfx.release) * sampleRate),
      )
    })
  },

  applyPercussionNotes = (
    data: Float32Array,
    beatsPerMinute: number,
    sampleRate: number,
    sfx: SfxCore,
    notes: Note[],
    offset: number,
    wave: (p: number) => number,
  ) => {
    const
      findNextNote = (start: number, pitch: number) => {
        while (++start < notes.length) {
          if (notes[start].pitch === pitch) { return notes[start] }
        }
        return undefined
      },
      qBeatsPerMinute = 4 * beatsPerMinute,
      samplesPerQBeat = Math.round(sampleRate * 60 / qBeatsPerMinute)

    notes.sort((a, b) => a.qBeatStart - b.qBeatStart).forEach((note, i) => {
      const
        start = note.qBeatStart * samplesPerQBeat,
        nextNote = findNextNote(i, note.pitch),
        nextStart = nextNote ? nextNote.qBeatStart * samplesPerQBeat : Infinity

      applySFX(
        data,
        sfx.attack,
        sfx.decay,
        sfx.gain,
        note.pitch,
        sfx.pitchSlide,
        sfx.release,
        sfx.sustain,
        sfx.sustainTime ?? .1,
        wave,

        sampleRate,
        offset + start,
        nextStart - start,
      )
    })
  }
