import { divide, interpolateLinear, minus, V, VZ } from "rokay/math/v"

import { GameStateLevel } from "../../../shared/games/types.gen"
import { AppClient } from "../../app"
import { ease, linear } from "../../camera/model"
import { Camera, CameraShake } from "../../camera/types.gen"
import { SIZE_BOARD_PIXELS } from "../../const"
import { FlashInOverlay, LevelWinOverlay } from "../overlays"

import { Anime, AnimeOverlay, AnimeStep } from "./model"
import { stepper } from "./win"


export const
  postLevelWin = (
    app: AppClient,
    camera: Camera,
    { level, world }: GameStateLevel,
    animeEnd: () => void,
    onEnd: () => void,
  ): Anime[] => {
    const crystalStart = V(SIZE_BOARD_PIXELS.x / 2 - 8, -16)
    const crystalEnd = minus(divide(SIZE_BOARD_PIXELS, 2), V(8, 8))
    const attrs = stepper(5, (frac) => ({
      magnitude: linear(0, 2, Math.pow(frac, 3)),
      pos: interpolateLinear(crystalStart, crystalEnd, ease(frac)),
    }))
    const crystal = {
      life: 0,
      pos: crystalStart,
      sprite: app.assets.crystal(level.color),
    }
    const shake = CameraShake(0, VZ, 0)

    return [
      AnimeOverlay(() =>
        LevelWinOverlay(level, {
          onClick() {
            world.crystals = [crystal]
            camera.shake = shake
            animeEnd()
          },
        })
      ),
      AnimeStep((dt) => {
        const [{ magnitude, pos }, done] = attrs(dt)
        crystal.pos = pos
        shake.magnitude = magnitude
        if (done) { camera.shake = undefined }
        return done
      }),
      AnimeOverlay(() => FlashInOverlay(2.5, level.color, onEnd)),
    ]
  }
