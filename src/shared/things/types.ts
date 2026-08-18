import { TypeADT, TypeArray, TypeNumber } from "rokay/data/type"

import { V } from "../maths/types"


export const
  ThingState = TypeADT({
    dying: {},
    idle: { cooldown: TypeNumber(), moves: TypeArray(TypeArray(V)) },
    moveTo: { path: TypeArray(V), speed: TypeNumber() },
  }),

  Thing = TypeADT({
    pawn: {
      cell: V,
      pos: V,
      scale: V,
      state: ThingState,
    },
  })
