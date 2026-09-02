import { size } from "rokay/browser/attr"
import { canvas } from "rokay/browser/elt"
import { fills, outline, withCtx } from "rokay/browser/game/danvas"
import { tab } from "rokay/data/array"
import { T, V } from "rokay/math/v"

import { BossName, ChessPiece, Thing } from "../shared/things/types.gen"

import { TextCanvas } from "./elts/text-canvas"


export type Assets =
  & {
    font9: Map<string, HTMLCanvasElement>
    font12: Map<string, HTMLCanvasElement>
    font16: Map<string, HTMLCanvasElement>
    font16cursive: Map<string, HTMLCanvasElement>
    font16italic: Map<string, HTMLCanvasElement>
  }
  & Record<ChessPiece, Record<"bad" | "good", HTMLCanvasElement>>
  & Record<BossName | "unicorn", HTMLCanvasElement>


// music: { bg: AudioBuffer }
// sfx: { button: AudioBuffer }
export const
  load = () =>
    Promise.all([
      loadImage("/art/sprites.png").then((image) => ({
        bishop: sprite(image, 4),
        king: sprite(image, 6),
        knight: sprite(image, 2),
        pawn: sprite(image, 1),
        queen: sprite(image, 5),
        rook: sprite(image, 3),
        unicorn: sprite(image, 0),
        Rebu: paintUnicorn(image, "red"),
        Barbin: paintUnicorn(image, "orange"),
        Halsik: paintUnicorn(image, "yellow"),
        Sicafant: paintUnicorn(image, "green"),
        Peanio: paintUnicorn(image, "blue"),
        Dinkus: paintUnicorn(image, "indigo"),
        "Boof Cake": paintUnicorn(image, "violet"),
        "Evernut Clapati": paintUnicorn(image, "black"),
      })),
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
      .then(([chessPieces, font9, font12, font16, font16italic, font16cursive]): Assets => ({
        // cached: {
        //   bgs: new Map<string, HTMLCanvasElement>(),
        //   cats: new Map<CatFM, HTMLCanvasElement>(),
        // },
        font9,
        font12,
        font16,
        font16cursive,
        font16italic,
        ...chessPieces,
        unicorn: chessPieces.unicorn.good,
      })),

  getSprite = (assets: Assets, thing: Thing) => {
    if (
      thing.type === "bishop"
      || thing.type === "king"
      || thing.type === "knight"
      || thing.type === "pawn"
      || thing.type === "queen"
      || thing.type === "rook"
    ) { return assets[thing.type][thing.alignment] }
    return assets[thing.type]
  }


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
    }),

  paint = (colors: Record<string, string[]>) =>
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
      console.log("colors:", colorSet)
    },

  paintUnicorn = (image: HTMLImageElement, color: string) =>
    canvas(size(16, 16), withCtx(
      (ctx) => {
        ctx.drawImage(image, 0, 0, 16, 16, 0, 0, 16, 16)
      },
      paint({
        // main colors
        "255,255,255,255": [color],
        "224,224,224,255": [color, "rgba(0, 0, 0, .1)"],
        // mane colors
        "204,204,221,255": [color, "rgba(0, 0, 0, .2)"],
        "179,179,194,255": [color, "rgba(0, 0, 0, .3)"],
        // "0,0,0,0", "255,255,0,255", "0,0,0,255"
      }),
      fills("#000"),
      outline(1),
    )),

  sprite = (image: HTMLImageElement, index: number) => {
    const bad = canvas(size(16, 16), withCtx(
      (ctx) => {
        ctx.drawImage(image, 16 * index, 0, 16, 16, 0, 0, 16, 16)
      },
      outline(1),
    ))
    return {
      bad,
      good: canvas(size(16, 16), withCtx(
        (ctx) => {
          ctx.drawImage(image, 16 * index, 0, 16, 16, 0, 0, 16, 16)
        },
        paint({
          "34,34,34,255": ["hsl(58,9%,93%)"],
        }),
        fills("#000"),
        outline(1),
      )),
    }
  }
