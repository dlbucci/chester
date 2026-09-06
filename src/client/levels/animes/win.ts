import { nop } from "rokay/data/fun"
import { divide, minus, plus, scale, unitOfAng, V } from "rokay/math/v"

import { Crystal, World } from "../../../shared/worlds/types.gen"
import { AppClient } from "../../app"
import { ease, linear } from "../../camera/model"
import { SIZE_BOARD_PIXELS, SIZE_CELL } from "../../const"
import { LEVELS } from "../model"
import { FlashOverlay, WinOverlay } from "../overlays"

import { Anime, AnimeOverlay, AnimeStep } from "./model"


export const
  stepper = <T>(sec: number, interpolate: (frac: number) => T) => {
    let prog = 0
    return (dt: number): [value: T, done: boolean] => {
      prog += dt
      return [interpolate(Math.min(1, prog / sec)), prog >= sec]
    }
  },

  win = (app: AppClient, world: World, animeEnd: () => void): Anime[] => {
    const attrs = stepper(5, (frac) => ({
      magnitude: linear(SIZE_BOARD_PIXELS.x * .75, SIZE_CELL.x, ease(frac)),
      shake: linear(0, 2, frac),
      velocity: linear(0, 5, ease(frac)),
    }))
    const center = minus(divide(SIZE_BOARD_PIXELS, 2), V(8, 8))

    let offset = 0

    const
      getPos = (index: number, magnitude: number, offset: number) => {
        return scale(
          unitOfAng(-Math.PI / 2 + offset + 2 * Math.PI * (index / (LEVELS.length - 1))),
          magnitude,
        )
      },

      crystals = LEVELS.slice(0, LEVELS.length - 1).map((level, i) => {
        return Crystal(i, getPos(i, SIZE_BOARD_PIXELS.x, 0), app.assets.crystal(level.color))
      })

    return [
      AnimeStep(() => {
        world.crystals = crystals
        return true
      }),
      AnimeStep((dt) => {
        const [{ magnitude, velocity }, done] = attrs(dt)
        offset += velocity * dt
        crystals.forEach((crystal) => {
          crystal.pos = plus(center, getPos(crystal.life, magnitude, offset))
        })
        return done
      }),
      AnimeOverlay(() => FlashOverlay(5, "#fff", { onDone: nop, onWhite: animeEnd })),
      AnimeOverlay(() => WinOverlay(app)),
    ]
  }
