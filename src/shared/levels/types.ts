import { TypeADT, TypeArray, TypeNumber, TypeObject, TypeString, TypeWord } from "rokay/data/type"

import { V } from "../maths/types"
import { Thing, ThingType } from "../things/types"


export const
  LevelMeta = TypeObject({
    index: TypeNumber(),
    preamble: TypeArray(TypeString()),
    spawnRates: TypeWord("Record", {
      typeArgs: [ThingType, TypeNumber()],
    }),
  }),

  Level = TypeObject({
    boss: Thing,
    meta: LevelMeta,
    size: V,
    things: TypeArray(Thing),
    unicorn: Thing,
  }),

  LevelState = TypeADT({
    pre: {},
    playing: {},
    boss: {},
    dead: {},
    post: {},
  })
