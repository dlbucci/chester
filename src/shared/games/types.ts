import { TypeADT } from "rokay/data/type"

import { Level } from "../levels/types"
import { World } from "../worlds/types"


export const
  GameState = TypeADT({
    title: {},
    level: { level: Level, world: World },
  })
