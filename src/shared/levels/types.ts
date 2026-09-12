import { TypeArray, TypeNumber, TypeObject, TypeString, TypeWord } from "rokay/data/type"

import { V } from "../maths/types"
import { BossName, ChessPiece } from "../things/types"


export const
  SpawnArea = TypeObject({
    pos: V,
    size: V,
    type: ChessPiece,
  }),

  Level = TypeObject({
    bossName: BossName,
    color: TypeString(),
    index: TypeNumber(),
    preamble: TypeArray(TypeString()),
    size: V,
    spawnAreas: TypeArray(SpawnArea),
    spawnRates: TypeWord("Record", {
      typeArgs: [ChessPiece, TypeNumber()],
    }),
  })
