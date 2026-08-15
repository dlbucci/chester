import { TypeArray, TypeObject, TypeUndefined, TypeUnion } from "rokay/data/type"

import { V } from "../maths/types"
import { Unicorn } from "../unicorns/types"


export const
  Level = TypeObject({ data: TypeArray(TypeArray(TypeUnion([Unicorn, TypeUndefined()]))), size: V })
