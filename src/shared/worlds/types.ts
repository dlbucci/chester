import { TypeArray, TypeNumber, TypeObject, TypeWord } from "rokay/data/type"

import { V } from "../maths/types"
import { Thing } from "../things/types"


export const
  Crystal = TypeObject({
    life: TypeNumber(),
    pos: V,
    sprite: TypeWord("HTMLCanvasElement"),
  }),

  World = TypeObject({
    boss: Thing,
    captured: TypeArray(Thing),
    crystals: TypeArray(Crystal),
    things: TypeArray(Thing),
    unicorn: Thing,
  })
