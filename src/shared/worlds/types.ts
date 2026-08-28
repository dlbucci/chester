import { TypeArray, TypeObject } from "rokay/data/type"

import { Thing } from "../things/types"


export const
  World = TypeObject({
    boss: Thing,
    things: TypeArray(Thing),
    unicorn: Thing,
  })
