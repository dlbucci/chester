import { divide, interpolateLinear, minus, V, VZ } from "rokay/math/v"
import { Prop } from "rokay/prop/prop"

import { GameState, GameStateLevel, GameStateLevelBoss, GameStateLevelBossIntro, GameStateWin } from "../../../shared/games/types.gen"
import { pgIndex, pgLevel } from "../../../shared/pages.gen"
import { AppClient } from "../../app"
import { ease } from "../../camera/model"
import { Camera, CameraShake } from "../../camera/types.gen"
import { SIZE_BOARD_PIXELS } from "../../const"
import { LEVELS } from "../model"
import { FlashOverlay, LevelWinOverlay } from "../overlays"

import { AnimeOverlay, AnimeStep } from "./model"


export const
  postLevelWin = (
    app: AppClient,
    camera: Camera,
    gameState: Prop<GameState>,
    { level, world }: GameStateLevel | GameStateLevelBoss | GameStateLevelBossIntro,
    animeEnd: () => void,
  ) => {
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
            world.crystal = crystal
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
        animeEnd()
      }),
      AnimeStep((dt) => {
        crystal.life += dt
        if (crystal.life < 5) {
          shake.magnitude = crystal.life / 5 * 2
          return
        }
        camera.shake = undefined
        animeEnd()
      }),
      AnimeOverlay(() =>
        FlashOverlay(5, level.color, {
          onDone() { animeEnd() },
          onWhite() {
            if (level.index + 1 < LEVELS.length) {
              app.router.replace(
                level.index + 1 < LEVELS.length ? pgLevel(level.index + 1) : pgIndex(),
              )
            } else {
              gameState.set(() => GameStateWin(level, world))
            }
          },
        })
      ),
    ]
  }
