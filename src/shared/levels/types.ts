import { TypeArray, TypeNumber, TypeObject, TypeString, TypeWord } from "rokay/data/type"

import { V } from "../maths/types"
import { ThingType } from "../things/types"


export const
  Level = TypeObject({
    index: TypeNumber(),
    preamble: TypeArray(TypeString()),
    size: V,
    spawnRates: TypeWord("Record", {
      typeArgs: [ThingType, TypeNumber()],
    }),
  })
