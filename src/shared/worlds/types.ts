import { edit, TypeInt, TypeObject } from "rokay/data/type"

import { Unicorn } from "../unicorns/types"


export const
  World = TypeObject({ level: edit(TypeInt()), unicorn: Unicorn })
