import { GameStateLevel } from "../../../shared/games/types.gen"
import { Camera } from "../../camera/types.gen"
import { LevelPreOverlay } from "../overlays"

import { Anime, AnimeOverlay } from "./model"


export const
  preLevel = (camera: Camera, state: GameStateLevel, onEnd: () => void): Anime[] => {
    return [AnimeOverlay(() => LevelPreOverlay(camera, state, onEnd))]
  }
