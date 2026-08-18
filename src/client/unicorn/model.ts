import { mapNotNil } from "rokay/data/array"
import { plus, V } from "rokay/math/v"

import { getPath } from "../paths/models"


export const
  KNIGHT_MOVEMENTS = [
    V(-1, -2),
    V(1, -2),
    V(-2, -1),
    V(2, -1),
    V(-2, 1),
    V(2, 1),
    V(-1, 2),
    V(1, 2),
  ],

  UNICORN_COOLDOWN_SEC = 1,
  UNICORN_OFFSET = V(8, 14),

  getMoves = (cell: V, levelSize: V): V[][] =>
    mapNotNil(KNIGHT_MOVEMENTS, (target) => {
      const pos = plus(cell, target)
      return pos.x < 0 || pos.x >= levelSize.x || pos.y < 0 || pos.y >= levelSize.y * 10 ?
          undefined
        :
          getPath(cell, pos)
    })
