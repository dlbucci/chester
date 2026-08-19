import { TypeADT, TypeArray, TypeNumber } from "rokay/data/type"

import { V } from "../maths/types"


export const
  ThingState = TypeADT({
    dying: {
      ang: TypeNumber(),
      lifetime: TypeNumber(),
      vel: V,
      velAng: TypeNumber(),
    },
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
    unicorn: {
      cell: V,
      pos: V,
      scale: V,
      state: ThingState,
    },
  })
