import { tab } from "rokay/data/array"

import { TextCanvas } from "./elts/text-canvas"


export type Assets = {
  // cached: { bgs: Map<string, HTMLCanvasElement>, cats: Map<CatFM, HTMLCanvasElement> }
  unicorn: HTMLImageElement
  font9: Map<string, HTMLCanvasElement>
  font12: Map<string, HTMLCanvasElement>
  font16: Map<string, HTMLCanvasElement>
  font16cursive: Map<string, HTMLCanvasElement>
  font16italic: Map<string, HTMLCanvasElement>
  // music: { bg: AudioBuffer }
  // sfx: { button: AudioBuffer }
}


export const
  load = () =>
    Promise.all([
      loadImage("/art/unicorn.png"),
      // loadImage("/art/items.png"),
      // loadImage("/art/work.png"),
      loadFont("9px var(--font-monospace)"),
      loadFont("12px var(--font-monospace)", 4),
      loadFont("16px var(--font-monospace)", 6),
      loadFont("italic 16px var(--font-monospace)", 6),
      loadFont("bold 16px cursive", 6),
      // sfxKikisCafeButton(new AudioContext()),
      // songKikisCafeBGMusic(new AudioContext()),
    ])
      .then(([unicorn, font9, font12, font16, font16italic, font16cursive]): Assets => ({
        // cached: {
        //   bgs: new Map<string, HTMLCanvasElement>(),
        //   cats: new Map<CatFM, HTMLCanvasElement>(),
        // },
        unicorn,
        font9,
        font12,
        font16,
        font16cursive,
        font16italic,
      }))


const
  loadFont = (font: string, minWidth = 3, fill = "#fff") =>
    new Promise<Map<string, HTMLCanvasElement>>((res) => {
      res(
        new Map<string, HTMLCanvasElement>(
          tab(0x7f - 0x20, (i) => String.fromCharCode(0x20 + i)).map((letter) => [
            letter,
            TextCanvas(letter, {
              fill,
              font,
              minWidth,
            }),
          ]),
        ),
      )
    }),

  loadImage = (src: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        res(img)
      }
      img.onerror = (e) => {
        rej(e)
      }
    })
