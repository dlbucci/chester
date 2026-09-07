import { GameStateLevel } from "../../shared/games/types.gen"
import { worldNew } from "../worlds/model"

import { LEVELS } from "./model"


export const
  LevelPage = (id: number) => {
    const level = LEVELS[id]
    return GameStateLevel(level, worldNew(level))
  }
