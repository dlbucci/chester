import { mapNotNil } from "rokay/data/array"
import { plus, V } from "rokay/math/v"

import { getPath } from "../paths/model"


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
  PAWN_MOVEMENTS = [V(0, 1)],

  THING_COOLDOWNS = { pawn: 2 },
  THING_SPEEDS = { pawn: .5 },

  getMoves = (cell: V, movements: V[], levelSize: V): V[][] =>
    mapNotNil(movements, (movement) => {
      const pos = plus(cell, movement)
      return pos.x < 0 || pos.x >= levelSize.x || pos.y < 0 || pos.y >= levelSize.y ?
          undefined
        :
          getPath(cell, pos)
    })
