import { GameStateLevel } from "../../shared/games/types.gen"
import { LevelStatePre } from "../../shared/levels/types.gen"


export const
  LevelPage = (id: number) =>
    GameStateLevel(id, LevelStatePre())
