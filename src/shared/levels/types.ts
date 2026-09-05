import { TypeArray, TypeNumber, TypeObject, TypeString, TypeWord } from "rokay/data/type"

import { V } from "../maths/types"
import { BossName, ThingType } from "../things/types"


export const
  Level = TypeObject({
    bossName: BossName,
    color: TypeString(),
    index: TypeNumber(),
    preamble: TypeArray(TypeString()),
    size: V,
    spawnRates: TypeWord("Record", {
      typeArgs: [ThingType, TypeNumber()],
    }),
  })
