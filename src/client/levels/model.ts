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
      "Rebu",
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
    Level("Barbin", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level("Halsik", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level("Sicafant", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level("Peanio", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level("Dinkus", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level("Boof Cake", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level("Evernut Clapati", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
  ]
