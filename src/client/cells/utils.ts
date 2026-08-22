import { divideComponents, floor, plus, scaleComponents } from "rokay/math/v"

import { V } from "../../shared/maths/types.gen"
import { SIZE_CELL, SIZE_CELL_HALF } from "../const"


export const
  cellToPos = (cell: V) =>
    plus(scaleComponents(cell, SIZE_CELL), SIZE_CELL_HALF),

  posToCell = (pos: V) =>
    floor(divideComponents(pos, SIZE_CELL))
