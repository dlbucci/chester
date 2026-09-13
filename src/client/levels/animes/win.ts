import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { match } from "rokay/browser/match"
import { onPointerdown } from "rokay/browser/on"
import { backgroundColor, color, flexDirection, gap, position, textAlign, top } from "rokay/browser/style"
import { divide, minus, plus, scale, unitOfAng, V } from "rokay/math/v"
import { PropBasic } from "rokay/prop/basic"

import { pgIndex } from "../../../shared/pages.gen"
import { THING_STATS } from "../../../shared/things/model"
import { ThingStateMoveTo } from "../../../shared/things/types.gen"
import { Crystal, World } from "../../../shared/worlds/types.gen"
import { AppClient } from "../../app"
import { ease, linear } from "../../camera/model"
import { cellToPos } from "../../cells/utils"
import { SIZE_BOARD_PIXELS, SIZE_CELL } from "../../const"
import { $messageEnter } from "../../style/utils.gen"
import { LEVELS, TUCKER_WIN_PATH, UNICORN_WIN_PATH } from "../model"
import { FlashInOverlay, Overlay } from "../overlays"

import { Anime, AnimeGloverlay, AnimeOverlay, AnimeStep } from "./model"
import { KillAllEnemiesStep } from "./steps"


export const
  stepper = <T>(sec: number, interpolate: (frac: number) => T) => {
    let prog = 0
    return (dt: number): [value: T, done: boolean] => {
      prog += dt
      return [interpolate(Math.min(1, prog / sec)), prog >= sec]
    }
  },

  win = (app: AppClient, world: World, onDone: () => void): Anime[] => {
    const attrs = stepper(5, (frac) => ({
      magnitude: linear(SIZE_BOARD_PIXELS.x * .75, SIZE_CELL.x, ease(frac)),
      shake: linear(0, 2, Math.pow(frac, 3)),
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
      KillAllEnemiesStep(world),
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
      AnimeGloverlay(() => FlashInOverlay(2.5, "#fff", onDone)),
    ]
  },

  wintro = (app: AppClient, world: World) => {
    return [
      AnimeOverlay(() => {
        const
          messages = `Tucker?
Chester?
You finally made it!
What took you so long?
The End`.split(
            "\n",
          ),
          messageIndex = PropBasic(0)

        return Overlay(
          backgroundColor("transparent"),
          color("#333"),
          flexDirection("column"),
          gap(".5em"),
          apd(match(messageIndex, (index) =>
            index >= 0 ?
              div($messageEnter, position("relative"), textAlign("center"), top("-16px"), apd(
                messages[index],
              ))
            :
              undefined
          )),
          onPointerdown(() => {
            messageIndex.set((_index) => {
              if (_index + 1 === 2) {
                world.unicorn.state = ThingStateMoveTo(
                  UNICORN_WIN_PATH.slice(1).map(cellToPos),
                  THING_STATS.unicorn.speed,
                )
                if (world.tucker) {
                  world.tucker.state = ThingStateMoveTo(
                    TUCKER_WIN_PATH.slice(1).map(cellToPos),
                    THING_STATS.unicorn.speed,
                  )
                }
              }
              if (_index + 1 < messages.length) { return _index + 1 }
              app.router.replace(pgIndex())
              return _index
            })
          }),
        )
      }),
    ]
  }
