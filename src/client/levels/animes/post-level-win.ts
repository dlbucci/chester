import { divide, interpolateLinear, minus, V, VZ } from "rokay/math/v"

import { GameStateLevel, GameStateLevelBoss } from "../../../shared/games/types.gen"
import { AppClient } from "../../app"
import { ease } from "../../camera/model"
import { Camera, CameraShake } from "../../camera/types.gen"
import { SIZE_BOARD_PIXELS } from "../../const"
import { FlashOverlay, LevelWinOverlay } from "../overlays"

import { Anime, AnimeOverlay, AnimeStep } from "./model"


export const
  postLevelWin = (
    app: AppClient,
    camera: Camera,
    { level, world }: GameStateLevel | GameStateLevelBoss,
    animeEnd: () => void,
    onEnd: () => void,
  ): Anime[] => {
    const crystalStart = V(SIZE_BOARD_PIXELS.x / 2 - 8, -16)
    const crystalEnd = minus(divide(SIZE_BOARD_PIXELS, 2), V(8, 8))
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
            animeEnd()
          },
        })
      ),
      AnimeStep((dt) => {
        crystal.life += dt
        if (crystal.life < 5) {
          crystal.pos = interpolateLinear(crystalStart, crystalEnd, ease(crystal.life / 5))
          return
        }
        crystal.life = 0
        camera.shake = shake
        return true
      }),
      AnimeStep((dt) => {
        crystal.life += dt
        if (crystal.life < 5) {
          shake.magnitude = crystal.life / 5 * 2
          return
        }
        camera.shake = undefined
        return true
      }),
      AnimeOverlay(() => FlashOverlay(5, level.color, { onDone: animeEnd, onWhite: onEnd })),
    ]
  }
