import { edit, TypeInt, TypeObject } from "rokay/data/type"


export const
  World = TypeObject({ level: edit(TypeInt()) })
