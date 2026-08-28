import { GameStateLevelPre } from "../../shared/games/types.gen"
import { worldNew } from "../worlds/model"

import { LEVELS } from "./model"


export const
  LevelPage = (id: number) => {
    const level = LEVELS[id]
    return GameStateLevelPre(level, worldNew(level))
  }
