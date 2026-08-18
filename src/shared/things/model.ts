import { mapNotNil } from "rokay/data/array"
import { plus, V } from "rokay/math/v"

import { getPath } from "../paths/model"


const
  KNIGHT_MOVEMENTS = [
    V(-1, -2),
    V(1, -2),
    V(-2, -1),
    V(2, -1),
    V(-2, 1),
    V(2, 1),
    V(-1, 2),
    V(1, 2),
  ]


export const
  THING_COOLDOWNS = { pawn: 2, unicorn: 1 },
  THING_MOVEMENTS = {
    knight: KNIGHT_MOVEMENTS,
    pawn: [V(0, 1)],
    unicorn: KNIGHT_MOVEMENTS,
  },
  THING_OFFSETS = { pawn: V(-8, -12), unicorn: V(-8, -12) },
  THING_SPEEDS = { pawn: .5, unicorn: 1 },

  getMoves = (cell: V, movements: V[], levelSize: V): V[][] =>
    mapNotNil(movements, (movement) => {
      const pos = plus(cell, movement)
      return pos.x < 0 || pos.x >= levelSize.x || pos.y < 0 || pos.y >= levelSize.y ?
          undefined
        :
          getPath(cell, pos)
    })
