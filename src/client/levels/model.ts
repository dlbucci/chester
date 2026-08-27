import { tab } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { V, VZ } from "rokay/math/v"

import { Level, LevelMeta } from "../../shared/levels/types.gen"
import { getMoves, THING_STATS } from "../../shared/things/model"
import { Thing, ThingStateIdle } from "../../shared/things/types.gen"
import { cellToPos } from "../cells/utils"
import { SIZE_BOARD } from "../const"


export const
  LEVELS = tab(8, (i) => {
    const
      meta = LevelMeta(
        i,
        i === 0 ?
          [
            "You're looking for something, aren't you?",
            "Someone, perhaps?",
            "Where should you go, little pony?",
            "Seek out wise Rebu.",
            "He will get you where you need to be.",
            "Wake Up",
          ]
        :
          ["TODO"],
        {
          bishop: 8,
          king: 8,
          knight: 8,
          pawn: 8,
          queen: 8,
          rook: 8,
          unicorn: 0,
        },
      ),
      size = V(SIZE_BOARD.x, (3 + meta.index) * SIZE_BOARD.y),
      cell = V(pick([2, size.x - 3]), size.y - 2),
      unicorn = Thing(
        cell,
        cellToPos(cell),
        V(1, 1),
        ThingStateIdle(0, getMoves(cell, THING_STATS.unicorn.movements, size)),
        "unicorn",
      ),
      boss = Thing(
        VZ,
        VZ,
        V(1, 1),
        ThingStateIdle(0, getMoves(VZ, THING_STATS.pawn.movements, size)),
        "pawn",
      ),
      things: Thing[] = [unicorn, boss]

    return Level(boss, meta, size, things, unicorn)
  })
