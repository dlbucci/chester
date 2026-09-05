import { VZ } from "rokay/math/v"

import { Level } from "../../../shared/levels/types.gen"
import { AppClient } from "../../app"
import { cameraPos } from "../../camera/model"
import { Camera, CameraStateEaseTo } from "../../camera/types.gen"
import { BossIntroOverlay } from "../overlays"

import { Anime, AnimeOverlay, AnimeStep } from "./model"


export const
  bossIntro = (
    _app: AppClient,
    camera: Camera,
    level: Level,
    animeEnd: () => void,
    onEnd: () => void,
  ): Anime[] => {
    return [
      AnimeStep(() => {
        camera.state = CameraStateEaseTo(cameraPos(camera, VZ), 1, camera.pos, 0)
        animeEnd()
      }),
      AnimeStep(() => {
        if (camera.state.t === "idle") { animeEnd() }
      }),
      AnimeOverlay(() => BossIntroOverlay(level, 5, onEnd)),
    ]
  }
