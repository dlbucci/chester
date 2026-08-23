import { TypeADT, TypeInt } from "rokay/data/type"


export const
  GameState = TypeADT({
    levelPre: { index: TypeInt() },
    level: { index: TypeInt() },
    title: {},
  })
