import { opt, TypeArray, TypeNumber, TypeObject, TypeStringUnion, TypeWord } from "rokay/data/type"

import { V } from "../maths/types"
import { Thing } from "../things/types"


export const
  Crystal = TypeObject({
    life: TypeNumber(),
    pos: V,
    sprite: TypeWord("HTMLCanvasElement"),
  }),

  Terrain = TypeStringUnion(["grass", "water", "ice"]),

  World = TypeObject({
    boss: opt(Thing),
    captured: TypeArray(Thing),
    crystals: TypeArray(Crystal),
    fruit: TypeArray(Thing),
    terrain: TypeArray(TypeArray(Terrain)),
    things: TypeArray(Thing),
    tucker: opt(Thing),
    unicorn: Thing,
  })
