import { TypeArray, TypeImport, TypeObject } from "rokay/data/type"

import { V } from "../maths/types"
import { Thing } from "../things/types"


export const
  Level = TypeObject({
    size: V,
    things: TypeArray(Thing),
    unicorn: TypeImport("ThingUnicorn", "../things/types.gen.js"),
  })
