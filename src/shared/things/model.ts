import { mapNotNil, tab } from "rokay/data/array"
import { plus, scale, V } from "rokay/math/v"

import { getDiagonalPath, getPath } from "../paths/model"

import { BossName, ChessPiece, Thing } from "./types.gen"


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
  frame: number
  movements: V[]
  speed: number
}


const
  ThingStats = (cooldown: number, speed: number, movements: V[], frame = 0): ThingStats => ({
    cooldown,
    frame,
    movements,
    speed,
  })


export const
  THING_STATS: Record<BossName | ChessPiece | "unicorn", ThingStats> = {
    bishop: ThingStats(2, 50, BISHOP_MOVEMENTS, 3),
    king: ThingStats(2, 50, KING_MOVEMENTS, 5),
    knight: ThingStats(2, 50, KNIGHT_MOVEMENTS, 1),
    pawn: ThingStats(2, 50, [V(0, 1)]),
    queen: ThingStats(2, 50, QUEEN_MOVEMENTS, 4),
    rook: ThingStats(2, 50, ROOK_MOVEMENTS, 2),
    unicorn: ThingStats(1, 100, KNIGHT_MOVEMENTS),

    Rebu: ThingStats(2, 50, KNIGHT_MOVEMENTS),
    Barbin: ThingStats(2, 50, KNIGHT_MOVEMENTS),
    Halsik: ThingStats(2, 50, KNIGHT_MOVEMENTS),
    Sicafant: ThingStats(2, 50, KNIGHT_MOVEMENTS),
    Peanio: ThingStats(2, 50, KNIGHT_MOVEMENTS),
    Dinkus: ThingStats(2, 50, KNIGHT_MOVEMENTS),
    "Boof Cake": ThingStats(2, 50, KNIGHT_MOVEMENTS),
    "Evernut Clapati": ThingStats(2, 50, KNIGHT_MOVEMENTS),
  },

  getMoves = (thing: Thing, levelSize: V): V[][] => {
    if (thing.type === "apple" || thing.type === "banana" || thing.type === "orange") { return [] }
    const { movements } = THING_STATS[thing.type]
    return mapNotNil(movements, (movement) => {
      const pos = plus(thing.cell, movement)
      return pos.x < 0 || pos.x >= levelSize.x || pos.y < 0 || pos.y >= levelSize.y ?
          undefined
        : movements === KNIGHT_MOVEMENTS ?
          getPath(thing.cell, pos)
        :
          getDiagonalPath(thing.cell, pos)
    })
  }
