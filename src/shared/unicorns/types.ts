import { TypeADT, TypeArray, TypeNumber, TypeObject } from "rokay/data/type"

import { V } from "../maths/types"


export const
  UnicornState = TypeADT({
    idle: { cooldown: TypeNumber(), moves: TypeArray(TypeArray(V)) },
    moveTo: { path: TypeArray(V), speed: TypeNumber() },
  }),

  Unicorn = TypeObject({
    cell: V,
    pos: V,
    scale: V,
    state: UnicornState,
  })
