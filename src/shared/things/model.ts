import { mapNotNil, tab } from "rokay/data/array"
import { plus, scale, V } from "rokay/math/v"

import { getPath } from "../paths/model"

import { Thing } from "./types.gen"


const
  DIAG_MOVEMENTS = [V(-1, -1), V(-1, 1), V(1, -1), V(1, 1)],
  FLAT_MOVEMENTS = [V(-1, 0), V(1, 0), V(0, -1), V(0, 1)],
  BISHOP_MOVEMENTS = DIAG_MOVEMENTS.flatMap((d) => tab(7, (i) => scale(d, i + 1))),
  ROOK_MOVEMENTS = FLAT_MOVEMENTS.flatMap((d) => tab(7, (i) => scale(d, i + 1))),
  KING_MOVEMENTS = [...DIAG_MOVEMENTS, ...FLAT_MOVEMENTS],
  QUEEN_MOVEMENTS = [...BISHOP_MOVEMENTS, ...ROOK_MOVEMENTS],
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


type ThingStats = {
  cooldown: number
  movements: V[]
  offset: V
  speed: number
}


const
  ThingStats = (cooldown: number, speed: number, offset: V, movements: V[]): ThingStats => ({
    cooldown,
    speed,
    offset,
    movements,
  })


export const
  THING_STATS: Record<Thing["t"], ThingStats> = {
    bishop: ThingStats(2, .5, V(-8, -12), BISHOP_MOVEMENTS),
    king: ThingStats(2, .5, V(-8, -12), KING_MOVEMENTS),
    knight: ThingStats(2, .5, V(-8, -12), KNIGHT_MOVEMENTS),
    pawn: ThingStats(2, .5, V(-8, -12), [V(0, 1)]),
    queen: ThingStats(2, .5, V(-8, -12), QUEEN_MOVEMENTS),
    rook: ThingStats(2, .5, V(-8, -12), ROOK_MOVEMENTS),
    unicorn: ThingStats(1, 1, V(-8, -12), KNIGHT_MOVEMENTS),
  },

  getMoves = (cell: V, movements: V[], levelSize: V): V[][] =>
    mapNotNil(movements, (movement) => {
      const pos = plus(cell, movement)
      return pos.x < 0 || pos.x >= levelSize.x || pos.y < 0 || pos.y >= levelSize.y ?
          undefined
        :
          getPath(cell, pos)
    })
