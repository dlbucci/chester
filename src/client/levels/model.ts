import { V } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { SIZE_BOARD } from "../const"


const
  spawnRates = (rates: Partial<Level["spawnRates"]>): Level["spawnRates"] => ({
    bishop: 8,
    king: 8,
    knight: 8,
    pawn: 8,
    queen: 8,
    rook: 8,
    unicorn: 0,
    ...rates,
  })


let
  i = -1


export const
  LEVELS = [
    Level(
      ++i,
      [
        "You're looking for something, aren't you?",
        "Someone, perhaps?",
        "Where should you go, little pony?",
        "Seek out wise Rebu.",
        "He will get you where you need to be.",
        "Wake Up",
      ],
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level(++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level(++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level(++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level(++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level(++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level(++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level(++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
  ]
