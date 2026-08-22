import { TypeADT, TypeInt } from "rokay/data/type"

import { LevelState } from "../levels/types"


export const
  GameState = TypeADT({
    level: { index: TypeInt(), state: LevelState },
    title: {},
  })
