import { divideComponents, floor_, plus_, scaleComponents } from "rokay/math/v"

import { V } from "../../shared/maths/types.gen"
import { AppClient } from "../app"


export const
  cellToPos = (app: AppClient, cell: V) => {
    const _size = app.size.get()
    return plus_(scaleComponents(cell, _size.cell), _size.cellHalf)
  },

  posToCell = (app: AppClient, pos: V) => {
    const _size = app.size.get()
    return floor_(divideComponents(pos, _size.cell))
  }
