import { pick } from "rokay/math/random"
import { V, VZ } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { getMoves, THING_STATS } from "../../shared/things/model"
import { Thing, ThingStateIdle } from "../../shared/things/types.gen"
import { World } from "../../shared/worlds/types.gen"
import { cellToPos } from "../cells/utils"


export const
  worldNew = (level: Level): World => {
    const
      cell = V(pick([2, level.size.x - 3]), level.size.y - 2),
      unicorn = Thing(
        cell,
        cellToPos(cell),
        V(1, 1),
        ThingStateIdle(0, getMoves(cell, THING_STATS.unicorn.movements, level.size)),
        "unicorn",
      ),
      boss = Thing(
        VZ,
        VZ,
        V(1, 1),
        ThingStateIdle(0, getMoves(VZ, THING_STATS.pawn.movements, level.size)),
        "pawn",
      ),
      things: Thing[] = [unicorn, boss]
    return World(boss, things, unicorn)
  }
