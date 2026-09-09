import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { match } from "rokay/browser/match"
import { onPointerdown } from "rokay/browser/on"
import { backgroundColor, flexDirection, gap, textAlign, whiteSpace } from "rokay/browser/style"
import { divide, minus, plus, scale, unitOfAng, V } from "rokay/math/v"
import { Prop } from "rokay/prop/prop"

import { pgIndex } from "../../../shared/pages.gen"
import { Thing, ThingStateIdle } from "../../../shared/things/types.gen"
import { Crystal, World } from "../../../shared/worlds/types.gen"
import { AppClient } from "../../app"
import { ease, linear } from "../../camera/model"
import { cellToPos } from "../../cells/utils"
import { SIZE_BOARD, SIZE_BOARD_PIXELS, SIZE_CELL } from "../../const"
import { $messageEnter } from "../../style/utils.gen"
import { LEVELS } from "../model"
import { FlashInOverlay, FlashOutOverlay, Overlay } from "../overlays"

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
      AnimeOverlay(() =>
        FlashInOverlay(2.5, "#fff", () => {
          const cell = V(SIZE_BOARD.x - 2, 3)
          world.tucker = Thing(
            "good",
            cell,
            cellToPos(cell),
            V(-1, 1),
            ThingStateIdle(0, []),
            "unicorn",
          )
          const otherCell = V(1, 3)
          world.unicorn = Thing(
            "good",
            otherCell,
            cellToPos(otherCell),
            V(1, 1),
            ThingStateIdle(0, []),
            "unicorn",
          )
          world.crystals = []
          world.things = [world.unicorn, world.tucker]
          animeEnd()
        })
      ),
      AnimeOverlay(() => {
        const
          messages = `Tucker?
Chester?
You finally made it!
What took you so long?
The End`.split(
            "\n",
          ),
          messageIndex = Prop(() => -1)

        return Overlay(
          backgroundColor("transparent"),
          flexDirection("column"),
          gap(".5em"),
          whiteSpace("pre"),
          apd(
            match(messageIndex, (index) =>
              index >= 0 ? div($messageEnter, textAlign("center"), apd(messages[index])) : undefined
            ),
            FlashOutOverlay(2.5, "#fff", () => {
              messageIndex.set(() => 0)
            }),
          ),
          onPointerdown(() => {
            messageIndex.set((_index) => {
              if (_index + 1 < messages.length) { return _index + 1 }
              app.router.replace(pgIndex())
              return _index
            })
          }),
        )
      }),
    ]
  }
