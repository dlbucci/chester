import { TypeADT, TypeNumber } from "rokay/data/type"

import { Level } from "../levels/types"
import { World } from "../worlds/types"


export const
  GameState = TypeADT({
    title: {},
    levelPre: { level: Level, world: World },
    level: { level: Level, world: World },
    levelBossIntro: {
      level: Level,
      lifetime: TypeNumber(),
      world: World,
    },
    levelBoss: { level: Level, world: World },
    levelWin: { level: Level, world: World },
    win: { level: Level, world: World },
    dead: { level: Level, world: World },
  })
