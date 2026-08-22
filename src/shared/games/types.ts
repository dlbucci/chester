import { TypeADT, TypeInt } from "rokay/data/type"


export const
  GameState = TypeADT({
    level: { index: TypeInt() },
    title: {},
  })
