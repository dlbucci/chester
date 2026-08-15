import { edit, TypeInt, TypeObject } from "rokay/data/type"

import { Unicorn } from "../unicorn/types"


export const
  World = TypeObject({ level: edit(TypeInt()), unicorn: Unicorn })
