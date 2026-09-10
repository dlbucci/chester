import { size } from "rokay/browser/attr"
import { canvas } from "rokay/browser/elt"
import { fills, outline, withCtx } from "rokay/browser/game/danvas"
import { tab } from "rokay/data/array"
import { getOrPut } from "rokay/data/object"
import { T, V } from "rokay/math/v"

import { BossName, Thing } from "../shared/things/types.gen"

import { TextCanvas } from "./elts/text-canvas"
import { CRYSTAL, PIECES, UNICORN } from "./packed-images"


export type Assets =
  & {
    crystal: (color: string) => HTMLCanvasElement
    font9: Map<string, HTMLCanvasElement>
    font12: Map<string, HTMLCanvasElement>
    font16: Map<string, HTMLCanvasElement>
    font16cursive: Map<string, HTMLCanvasElement>
    font16italic: Map<string, HTMLCanvasElement>
    paintedPieces: (color: string | undefined) => HTMLCanvasElement
    paintedUnicorn: (color: string) => HTMLCanvasElement
  }
  & Record<BossName | "unicorn", HTMLCanvasElement>


export const
  load = () =>
    Promise.all([
      CRYSTAL,
      loadFont("9px var(--font-monospace)"),
      loadFont("12px var(--font-monospace)", 4),
      loadFont("16px var(--font-monospace)", 6),
      loadFont("italic 16px var(--font-monospace)", 6),
      loadFont("bold 16px cursive", 6),
      PIECES,
      UNICORN,
      // music: { bg: AudioBuffer }
      // sfx: { button: AudioBuffer }
      // sfxKikisCafeButton(new AudioContext()),
      // songKikisCafeBGMusic(new AudioContext()),
    ])
      .then(
        (
          [crystal, font9, font12, font16, font16italic, font16cursive, pieces, unicorn],
        ): Assets => ({
          crystal: cached((color) => Crystal(crystal, color)),
          font9,
          font12,
          font16,
          font16cursive,
          font16italic,
          paintedPieces: cached((color) =>
            paintAndOutline(pieces, color != null ?
              {
                "34,34,34,255": [color],
              }
            :
              undefined)
          ),
          unicorn: paintAndOutline(unicorn),
          Rebu: paintUnicorn(unicorn, "red"),
          Barbin: paintUnicorn(unicorn, "orange"),
          Halsik: paintUnicorn(unicorn, "yellow"),
          Sicafant: paintUnicorn(unicorn, "green"),
          Peanio: paintUnicorn(unicorn, "blue"),
          Dinkus: paintUnicorn(unicorn, "indigo"),
          "Boof Cake": paintUnicorn(unicorn, "violet"),
          "Evernut Clapati": paintUnicorn(unicorn, "black"),
          paintedUnicorn: cached((color) => paintUnicorn(unicorn, color)),
        }),
      ),

  getSprite = (assets: Assets, thing: Thing) => {
    if (
      thing.type === "bishop"
      || thing.type === "king"
      || thing.type === "knight"
      || thing.type === "pawn"
      || thing.type === "queen"
      || thing.type === "rook"
    ) { return assets.paintedPieces(thing.alignment === "good" ? "hsl(58,9%,93%)" : undefined) }
    return assets[thing.type]
  }


const
  cached = <T extends string | undefined>(cb: (...args: T[]) => HTMLCanvasElement) => {
    const cache: Record<string, HTMLCanvasElement> = {}
    return (...args: T[]) => getOrPut(cache, args.join(","), () => cb(...args))
  },

  Crystal = (image: HTMLCanvasElement, color: string) =>
    canvas(size(image.width, image.height), withCtx(
      (ctx) => {
        ctx.drawImage(image, 0, 0)
      },
      paint({
        "255,0,0,255": [color],
        "224,0,0,255": [color, "rgba(0,0,0,.1)"],
        "196,0,0,255": [color, "rgba(0,0,0,.2)"],
      }),
      fills("#000"),
      outline(1),
    )),

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

  paint = (colors: Record<string, string[]>, debug = false) =>
    (ctx: CanvasRenderingContext2D) => {
      const { data } = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
      const colorSet = new Set<string>()
      for (let i = 0; i < data.length; i += 4) {
        const slice = data.slice(i, i + 4).join(",")
        const fills = colors[slice]
        if (fills != null) {
          fills.forEach((fill) => {
            const pos = T(V((i / 4) % ctx.canvas.width, Math.floor(i / 4 / ctx.canvas.width)))
            if (fill === "transparent") {
              ctx.clearRect(...pos, 1, 1)
            } else {
              ctx.fillStyle = fill
              ctx.fillRect(...pos, 1, 1)
            }
          })
        } else {
          colorSet.add(slice)
        }
      }
      if (debug) { console.log("colors:", colorSet) }
    },

  paintAndOutline = (image: HTMLCanvasElement, paintArgs?: Record<string, string[]>) =>
    canvas(size(image.width, image.height), withCtx(
      (ctx) => {
        ctx.drawImage(image, 0, 0)
      },
      paintArgs != null ? paint(paintArgs) : undefined,
      fills("#000"),
      outline(1),
    )),

  paintUnicorn = (image: HTMLCanvasElement, color: string) =>
    paintAndOutline(image, {
      // main colors
      "255,255,255,255": [color],
      "224,224,224,255": [color, "rgba(0,0,0,.1)"],
      // mane colors
      "204,204,221,255": [color, "rgba(0,0,0,.2)"],
      "179,179,194,255": [color, "rgba(0,0,0,.3)"],
      // "0,0,0,0", "255,255,0,255", "0,0,0,255"
    })
