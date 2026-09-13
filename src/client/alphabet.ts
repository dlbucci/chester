import { size } from "rokay/browser/attr"
import { apd, Elt } from "rokay/browser/core"
import { canvas, div } from "rokay/browser/elt"
import { outline as $outline, withCtx } from "rokay/browser/game/danvas"
import { flexWrap, gap, justifyContent } from "rokay/browser/style"

import { paint } from "./assets"
import { ALPHABET } from "./packed-images"
import { $flexRow } from "./style/utils.gen"


export type CharOpts = {
  color?: string
  outline?: string
  scale?: number
  spacing?: number
}


export const
  characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,.!?': `,
  width1 = new Set(`il,.!':`),
  width3 = new Set(`If`),
  width5 = new Set(`MTVWXYmvwx`),
  characterInfo = characters.split("").reduce(
    (res, char, i) => {
      res[char] = {
        x: 5 * i,
        width: width1.has(char) ?
            1
          : width3.has(char) ?
            3
          : width5.has(char) ?
            5
          :
            4,
      }
      return res
    },
    {} as Record<string, { x: number, width: number }>,
  ),

  CharCanvas = (
    char: string,
    {
      color = "#fff",
      outline,
      scale = 1,
    }: CharOpts = {},
  ) => {
    const info = characterInfo[char]
    return info ?
        canvas(size(info.width * scale + (outline ? 2 : 0), 8 * scale + (outline ? 2 : 0)), withCtx(
          (ctx) => {
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(
              ALPHABET,
              info.x,
              0,
              5,
              8,
              outline ? 1 : 0,
              outline ? 1 : 0,
              5 * scale,
              8 * scale,
            )
          },
          color ?
            paint({
              "0,0,0,255": [color],
            })
          :
            undefined,
          outline ?
            (ctx) => {
              ctx.fillStyle = outline
              $outline(1)(ctx)
            }
          :
            undefined,
        ))
      :
        canvas(size(4, 8), withCtx((ctx) => {
          ctx.fillRect(0, 0, 4, 8)
        }))
  },

  SentenceDiv = (words: (Elt | string)[], opts: CharOpts = {}): HTMLDivElement =>
    div($flexRow, flexWrap("wrap"), gap("4px"), justifyContent("center"), apd(
      ...words.map((word) => typeof word === "string" ? WordDiv(word, opts) : word)
    )),

  WordDiv = (text: string, opts: CharOpts = {}) =>
    div($flexRow, gap(`${opts.spacing ?? (opts.outline ? 0 : (opts.scale ?? 1))}px`), apd(
      ...text.split("").map((char) => CharCanvas(char, opts))
    ))
