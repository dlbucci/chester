import { opt, TypeArray, TypeNumber, TypeObject, TypeWord } from "rokay/data/type"

import { V } from "../maths/types"
import { Thing } from "../things/types"


export const
  Crystal = TypeObject({
    life: TypeNumber(),
    pos: V,
    sprite: TypeWord("HTMLCanvasElement"),
  }),

  World = TypeObject({
    boss: opt(Thing),
    captured: TypeArray(Thing),
    crystals: TypeArray(Crystal),
    things: TypeArray(Thing),
    tucker: opt(Thing),
    unicorn: Thing,
  })
