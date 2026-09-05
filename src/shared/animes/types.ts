import { TypeADT, TypeWord } from "rokay/data/type"


export const
  Anime = TypeADT({
    elt: { elt: TypeWord("Elt") },
    step: { cb: TypeWord("(dt: number) => void") },
  })
