import { TypeArray, TypeObject } from "rokay/data/type"

import { V } from "../maths/types"
import { Thing } from "../things/types"
import { Unicorn } from "../unicorns/types"


export const
  Level = TypeObject({
    size: V,
    things: TypeArray(Thing),
    unicorn: Unicorn,
  })
