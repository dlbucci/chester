import { TypeADT, TypeInt } from "rokay/data/type"


export const
  GameState = TypeADT({
    title: {},
    levelPre: { index: TypeInt() },
    level: { index: TypeInt() },
    levelBoss: { index: TypeInt() },
  })
