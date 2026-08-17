import { TypeADT, TypeNumber, TypeObject } from "rokay/data/type"

import { V } from "../maths/types"


export const
  UnicornState = TypeADT({
    idle: {},
    moveTo: { pos: V, speed: TypeNumber() },
  }),

  Unicorn = TypeObject({
    pos: V,
    scale: V,
    state: UnicornState,
  })
