import { generateSFXBuffer, noiseWave, triangleWave } from "./sfx"


export const
  sfxChesterPieceSlide = generateSFXBuffer(
    0.07,
    0.07,
    0.25,
    92,
    -0.0002,
    0.05,
    0.44,
    0.03,
    noiseWave(),
  ),

  sfxChesterPieceBump = generateSFXBuffer(0.01, 0.06, 0.92, 18, 0, 0.05, 0.15, 0.06, (p) =>
    p > .5 ? 1 : 2 * (p / .5) - 1
  ),

  sfxChesterFadeIn = generateSFXBuffer(0.11, 0.35, 1, 21, -0.0001, 0.63, 0.54, 0.43, triangleWave),

  sfxChesterFadeUp = generateSFXBuffer(0.11, 0.35, 1, 21, 0.0001, 0.63, 0.54, 0.43, triangleWave),

  sfxChesterCrystal = generateSFXBuffer(
    0.03,
    0.08,
    0.84,
    78,
    0.0003,
    0.05,
    0.65,
    0.13,
    triangleWave,
  )


// export const
//   sfxChesterPieceSlide = generateSFXBuffer2(
//     EnvelopeF(0.07, 0.07, 0.25, 0.05, .03, 0.44),
//     PitchF(92, -0.0002),
//     noiseWave(),
//   ),
//
//   sfxChesterPieceBump = generateSFXBuffer2(
//     EnvelopeF(0.01, 0.06, 0.92, 0.05, 0.06, 0.15),
//     PitchF(18, 0),
//     sawtoothWave(.5),
//   ),
//
//   sfxChesterFadeIn = generateSFXBuffer2(
//     EnvelopeF(0.11, 0.35, 1, 0.63, 0.43, 0.54),
//     PitchF(21, -0.0001),
//     triangleWave,
//   )
