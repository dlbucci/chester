import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { animation, color, flexDirection, gap, whiteSpace } from "rokay/browser/style"
import { divide, interpolateLinear, minus, V, VZ } from "rokay/math/v"

import { GameStateLevel } from "../../../shared/games/types.gen"
import { WordDiv } from "../../alphabet"
import { AppClient } from "../../app"
import { ease, linear } from "../../camera/model"
import { Camera, CameraShake } from "../../camera/types.gen"
import { SIZE_BOARD_PIXELS } from "../../const"
import { $flexCenter, $messageEnter } from "../../style/utils.gen"
import { $gradientOverlay, FlashInOverlay, Overlay } from "../overlays"

import { Anime, AnimeGloverlay, AnimeOverlay, AnimeStep } from "./model"
import { KillAllEnemiesStep } from "./steps"
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

    return [
      KillAllEnemiesStep(world, (boss) => {
        const pos = minus(boss.pos, V(8, 8))
        crystalStart = pos
        crystal.pos = pos
        world.crystals = [crystal]
        camera.shake = shake
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
            $flexCenter,
            $messageEnter,
            flexDirection("column"),
            apd(WordDiv(level.bossName, { color: level.color, scale: 2 }), WordDiv("DEFEATED", {
              color: "red",
              scale: 2,
            })),
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
