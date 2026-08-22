import { TypeADT, TypeArray, TypeImport, TypeNumber, TypeObject } from "rokay/data/type"

import { V } from "../maths/types"
import { Thing } from "../things/types"


export const
  LevelMeta = TypeObject({ index: TypeNumber() }),

  Level = TypeObject({
    boss: Thing,
    meta: LevelMeta,
    size: V,
    things: TypeArray(Thing),
    unicorn: TypeImport("ThingUnicorn", "../things/types.gen.js"),
  }),

  LevelState = TypeADT({
    pre: {},
    playing: {},
    boss: {},
    dead: {},
    post: {},
  })
