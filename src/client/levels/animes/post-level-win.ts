import { apd } from "rokay/browser/core"
import { div, span } from "rokay/browser/elt"
import { animation, background, color, flexDirection, gap, textAlign, whiteSpace } from "rokay/browser/style"
import { float } from "rokay/math/random"
import { divide, interpolateLinear, minus, scale, unitOfAng, V, VZ } from "rokay/math/v"

import { GameStateLevel } from "../../../shared/games/types.gen"
import { ThingStateDying } from "../../../shared/things/types.gen"
import { AppClient } from "../../app"
import { ease, linear } from "../../camera/model"
import { Camera, CameraShake } from "../../camera/types.gen"
import { SIZE_BOARD_PIXELS } from "../../const"
import { $messageEnter } from "../../style/utils.gen"
import { $gradientOverlay, FlashInOverlay, Overlay } from "../overlays"

import { Anime, AnimeGloverlay, AnimeOverlay, AnimeStep } from "./model"
import { stepper } from "./win"


export const
  postLevelWin = (
    app: AppClient,
    camera: Camera,
    { level, world }: GameStateLevel,
    animeEnd: () => void,
    onEnd: () => void,
  ): Anime[] => {
    let crystalStart = V(SIZE_BOARD_PIXELS.x / 2 - 8, -16)
    const crystalEnd = minus(divide(SIZE_BOARD_PIXELS, 2), V(8, 8))
    const attrs = stepper(5, (frac) => ({
      magnitude: linear(0, 2, Math.pow(frac, 2)),
      pos: interpolateLinear(crystalStart, crystalEnd, ease(frac)),
    }))
    const crystal = {
      life: 0,
      pos: crystalStart,
      sprite: app.assets.crystal(level.color),
    }
    const shake = CameraShake(0, VZ, 0)
    let first = true

    return [
      AnimeStep(() => {
        if (world.boss != null) {
          if (world.things.includes(world.boss)) { return }
          if (first) {
            first = false
            const pos = minus(world.boss.pos, V(8, 8))
            crystalStart = pos
            crystal.pos = pos
            world.crystals = [crystal]
            camera.shake = shake
          }
        }
        world.things.forEach((thing) => {
          if (thing.state.t === "dying") { return }
          if (thing.alignment === "bad") {
            thing.state = ThingStateDying(
              0,
              1,
              scale(unitOfAng(float(-Math.PI * 3 / 8, -Math.PI * 5 / 8)), 100),
              1,
            )
          }
        })
        return world.things.every((thing) => thing.alignment === "good")
      }),
      AnimeOverlay(() => {
        setTimeout(animeEnd, 5 * 1000)
        return Overlay(
          animation(`${5}s boss-intro-overlay forwards`),
          color("hsl(352,78%,45%)"),
          flexDirection("column"),
          gap(".5em"),
          $gradientOverlay,
          whiteSpace("pre"),
          apd(div(
            $messageEnter,
            textAlign("center"),
            apd(span(color(level.color), apd(level.bossName)), "\nDEFEATED"),
          )),
        )
      }),
      AnimeStep((dt) => {
        const [{ magnitude, pos }, done] = attrs(dt)
        crystal.pos = pos
        shake.magnitude = magnitude
        if (done) { camera.shake = undefined }
        return done
      }),
      AnimeGloverlay(() => FlashInOverlay(2.5, level.color, onEnd)),
    ]
  }
