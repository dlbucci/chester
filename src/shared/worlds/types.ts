import { opt, TypeArray, TypeNumber, TypeObject, TypeWord } from "rokay/data/type"

import { V } from "../maths/types"
import { Thing } from "../things/types"


export const
  World = TypeObject({
    boss: Thing,
    captured: TypeArray(Thing),
    crystal: opt(TypeObject({
      life: TypeNumber(),
      pos: V,
      sprite: TypeWord("HTMLCanvasElement"),
    })),
    things: TypeArray(Thing),
    unicorn: Thing,
  })
